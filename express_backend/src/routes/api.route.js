import express from 'express';
import { loginController } from '../controllers/login.controller.js';
import { registerController } from '../controllers/register.controller.js';
import { logoutController } from '../controllers/logout.controller.js';
import { verifyAuth } from '../middleware/checkauth.middleware.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/logout', logoutController);

router.get('/check-auth', verifyAuth, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;