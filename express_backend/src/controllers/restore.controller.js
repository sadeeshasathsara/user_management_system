// controllers/restore.controller.js
import { restoreSystemBackup } from '../services/restore.service.js';

export const handleRestore = async (req, res) => {
    try {
        const { backupFileName } = req.body;

        if (!backupFileName || !backupFileName.endsWith('.enc')) {
            return res.status(400).json({ success: false, message: 'Invalid backup file name' });
        }

        await restoreSystemBackup(backupFileName);

        res.json({ success: true, message: 'Full restore completed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Restore failed', error: err.message });
    }
};
