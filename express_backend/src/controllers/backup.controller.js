import path from 'path';
import fs from 'fs-extra';
import { createSystemBackup } from '../services/backup.service.js';

const BACKUP_DIR = path.resolve('backups');

// Create and return backup file to client
export const handleBackupDownload = async (req, res) => {
    try {
        const filePath = await createSystemBackup();
        return res.download(filePath, path.basename(filePath));
    } catch (err) {
        console.error('Download Backup Error:', err);
        res.status(500).json({ success: false, message: 'Failed to generate backup' });
    }
};

// Utility: Clean old backups (keep latest 3)
export const cleanupOldBackups = async () => {
    try {
        const files = (await fs.readdir(BACKUP_DIR))
            .filter(f => f.endsWith('.zip.enc'))
            .map(f => ({
                name: f,
                time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time); // newest first

        const filesToDelete = files.slice(3); // keep latest 3

        for (const file of filesToDelete) {
            await fs.remove(path.join(BACKUP_DIR, file.name));
            const ivFile = `${file.name}.iv`;
            await fs.remove(path.join(BACKUP_DIR, ivFile));
        }

        if (filesToDelete.length > 0) {
            console.log(`🧹 Cleaned up ${filesToDelete.length} old backups`);
        }
    } catch (err) {
        console.error('Backup Cleanup Error:', err);
    }
};
