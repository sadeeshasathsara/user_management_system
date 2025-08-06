import multer from 'multer';
import path from 'path';
import fs from 'fs-extra'; // ✅ import fs-extra

// Set storage engine
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join('src', 'uploads');

        try {
            // ✅ Ensure the folder exists
            await fs.ensureDir(uploadPath);
            cb(null, uploadPath);
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

export const upload = multer({ storage, fileFilter });
