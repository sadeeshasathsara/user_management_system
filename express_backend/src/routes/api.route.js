import express from 'express';
import { loginController } from '../controllers/login.controller.js';
import { registerController } from '../controllers/register.controller.js';
import { logoutController } from '../controllers/logout.controller.js';
import { verifyAuth } from '../middleware/checkauth.middleware.js';
import { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment }
    from '../controllers/department.controller.js';

const router = express.Router();
import { upload } from '../middleware/multer.middleware.js'
import { createEmployeeController, deleteEmployeeController, getEmployeesController, updateEmployeeController } from '../controllers/employee.controller.js';

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/logout', logoutController);

router.post('/department', createDepartment);
router.get('/department', getAllDepartments);
router.get('/department/:id', getDepartmentById);
router.put('/department/:id', updateDepartment);
router.delete('/department/:id', deleteDepartment);

router.get('/check-auth', verifyAuth, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;