import express from 'express';
import { loginController } from '../controllers/login.controller.js';
import { deleteAccountController, getAdminsController, registerController, tougleAccountStatusController } from '../controllers/register.controller.js';
import { logoutController } from '../controllers/logout.controller.js';
import { verifyAuth } from '../middleware/checkauth.middleware.js';
import { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment }
    from '../controllers/department.controller.js';

const router = express.Router();
import { upload } from '../middleware/multer.middleware.js'
import { createEmployeeController, deleteEmployeeController, getEmployeesController, updateEmployeeController } from '../controllers/employee.controller.js';
import { createOrUpdateEmployeeEpfController, deleteEmployeeEpfExpenseController, getEmployeeEpfsController, getMaxEpfController, updateMaxEpfController } from '../controllers/epf.controller.js';
import { getEmployeesByQuery } from '../services/employee.service.js';
import { departmentStats, epfMonthlyContribution, statsController } from '../controllers/stats.controller.js';

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/logout', logoutController);

router.post('/emp/', verifyAuth, upload.single('profilePicture'), createEmployeeController);
router.put('/emp/:id', verifyAuth, upload.single('profilePicture'), updateEmployeeController);
router.delete('/emp/:id', verifyAuth, deleteEmployeeController);
router.get('/emp/', verifyAuth, getEmployeesController);

router.post('/department', verifyAuth, createDepartment);
router.get('/department', verifyAuth, getAllDepartments);
router.get('/department/:id', verifyAuth, getDepartmentById);
router.put('/department/:id', verifyAuth, updateDepartment);
router.delete('/department/:id', verifyAuth, deleteDepartment);

router.post('/epf/max', verifyAuth, updateMaxEpfController);
router.get('/epf/max', verifyAuth, getMaxEpfController);
router.get("/epf/emp", verifyAuth, getEmployeeEpfsController);
router.post("/epf/emp", verifyAuth, createOrUpdateEmployeeEpfController);
router.delete("/epf/emp/:epfId", verifyAuth, deleteEmployeeEpfExpenseController);

router.get('/admins', verifyAuth, getAdminsController);
router.post('/admins', verifyAuth, tougleAccountStatusController);
router.delete('/admins', verifyAuth, deleteAccountController);

router.get('/stats', verifyAuth, statsController);
router.get('/stats/dep', verifyAuth, departmentStats)
router.get('/stats/epf', verifyAuth, epfMonthlyContribution)

router.get('/check-auth', verifyAuth, async (req, res) => {
    const admins = await getEmployeesByQuery({ email: req.user.email })
    const admin = admins[0];

    res.status(200).json({
        success: true,
        user: {
            _id: req.user._id,
            email: req.user.email,
            name: admin.name
        }
    });
});

export default router;