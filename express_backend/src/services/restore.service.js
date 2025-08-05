// services/restore.service.js
import fs from 'fs-extra';
import path from 'path';
import unzipper from 'unzipper';
import crypto from 'crypto';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const BACKUP_DIR = path.resolve('backups');
const ENCRYPTION_KEY = crypto.createHash('sha256').update(process.env.BACKUP_ENCRYPTION_KEY).digest();

const DEPENDENCY_ORDER = [
    'department',
    'employee',
    'epf',
    'employeeepf',
    'otp'
];

export const restoreSystemBackup = async (backupFileName) => {
    const encryptedFilePath = path.join(BACKUP_DIR, backupFileName);
    const ivFilePath = `${encryptedFilePath}.iv`;
    const tempDir = path.join(BACKUP_DIR, `restore-temp-${Date.now()}`);
    const decryptedZipPath = path.join(tempDir, 'decrypted.zip');

    try {
        await fs.ensureDir(tempDir);

        // Load IV
        const ivHex = await fs.readFile(ivFilePath, 'utf8');
        const iv = Buffer.from(ivHex, 'hex');

        // Decrypt ZIP
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        const input = fs.createReadStream(encryptedFilePath);
        const output = fs.createWriteStream(decryptedZipPath);

        await new Promise((resolve, reject) => {
            input.pipe(decipher).pipe(output).on('finish', resolve).on('error', reject);
        });

        // Unzip
        await fs.createReadStream(decryptedZipPath).pipe(unzipper.Extract({ path: tempDir })).promise();

        // Read all .json files in the tempDir
        const allFiles = await fs.readdir(tempDir);
        const jsonFiles = allFiles.filter(f => f.endsWith('.json'));

        // Map of { collectionName: fullPath }
        const collections = jsonFiles.reduce((acc, file) => {
            const name = file.replace('.json', '').toLowerCase();
            acc[name] = path.join(tempDir, file);
            return acc;
        }, {});

        await mongoose.connect(process.env.MONGO_URI);

        // Sort based on DEPENDENCY_ORDER
        const sortedCollections = Object.keys(collections).sort((a, b) => {
            const aIndex = DEPENDENCY_ORDER.indexOf(a);
            const bIndex = DEPENDENCY_ORDER.indexOf(b);
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });

        // Restore each collection in order
        for (const collectionName of sortedCollections) {
            const data = await fs.readJson(collections[collectionName]);

            if (data.length > 0) {
                const collection = mongoose.connection.collection(collectionName);
                await collection.deleteMany({});
                await collection.insertMany(data, { ordered: false });
                console.log(`✅ Restored ${collectionName} (${data.length} records)`);
            }
        }

        // Restore uploads
        const uploadsSrc = path.join(tempDir, 'uploads');
        const uploadsDest = path.resolve('./src/uploads');

        if (await fs.pathExists(uploadsSrc)) {
            await fs.ensureDir(uploadsDest);
            await fs.copy(uploadsSrc, uploadsDest, { overwrite: true });
            console.log('✅ Uploads restored');
        }

        // Restore .env
        const envSrc = path.join(tempDir, '.env');
        const envDest = path.resolve('.env');

        if (await fs.pathExists(envSrc)) {
            // Optionally back up current .env
            await fs.copy(envDest, `${envDest}.backup.${Date.now()}`);
            await fs.copy(envSrc, envDest, { overwrite: true });
            console.log('✅ .env file restored');
        }

        console.log('✅ Full system restore completed.');
        return true;
    } catch (err) {
        console.error('❌ Restore failed:', err);
        throw err;
    } finally {
        await mongoose.connection?.close?.();
        await fs.remove(tempDir);
    }
};
