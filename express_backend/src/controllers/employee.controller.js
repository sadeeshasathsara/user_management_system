import fs from 'fs';
import path from 'path';
import {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByQuery
} from '../services/employee.service.js';

export const createEmployeeController = async (req, res) => {
    try {
        const employeeData = { ...req.body };
        if (req.file) {
            employeeData.profilePicture = req.file.filename;
        }

        const employee = await createEmployee(employeeData);
        res.status(201).json({ success: true, message: 'Employee created', data: employee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateEmployeeController = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedData = { ...req.body };
        if (req.file) {
            // Delete old picture
            const old = await getEmployeesByQuery({ _id: id });
            const oldFile = old[0]?.profilePicture;
            if (oldFile) {
                const filePath = path.join('src', 'uploads', oldFile);
                fs.existsSync(filePath) && fs.unlinkSync(filePath);
            }

            // Save new filename
            updatedData.profilePicture = req.file.filename;
        }

        const updated = await updateEmployee(id, updatedData);
        res.status(200).json({ success: true, message: 'Employee updated', data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteEmployeeController = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteEmployee(id);
        res.status(200).json({ success: true, message: 'Employee deleted' });
    } catch (err) {
        if (err.message.includes('not found')) {
            res.status(404).json({ success: false, message: err.message });
        } else if (err.message.includes('Invalid employee ID')) {
            res.status(400).json({ success: false, message: err.message });
        } else {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

export const getEmployeesController = async (req, res) => {
    try {
        const query = req.query;
        const employees = await getEmployeesByQuery(query);
        res.status(200).json({ success: true, data: employees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
