import express from 'express';
import { loginController } from '../controllers/login.controller.js';
import { registerController } from '../controllers/register.controller.js';
import { logoutController } from '../controllers/logout.controller.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/logout', logoutController);

export default router;