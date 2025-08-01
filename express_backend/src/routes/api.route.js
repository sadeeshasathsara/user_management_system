import express from 'express';
import { loginController } from '../controllers/login.controller.js';
import { registerController } from '../controllers/register.controller.js';
import { logoutController } from '../controllers/logout.controller.js';
import { verifyAuth } from '../middleware/checkauth.middleware.js';

const router = express.Router();
import { upload } from '../middleware/multer.middleware.js'
import { createEmployeeController, deleteEmployeeController, getEmployeesController, updateEmployeeController } from '../controllers/employee.controller.js';

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/logout', logoutController);

router.post('/emp/', verifyAuth, upload.single('profilePicture'), createEmployeeController);
router.put('/emp/:id', verifyAuth, upload.single('profilePicture'), updateEmployeeController);
router.delete('/emp/:id', verifyAuth, deleteEmployeeController);
router.get('/emp/', verifyAuth, getEmployeesController);

router.get('/check-auth', verifyAuth, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;