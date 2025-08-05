import fs from 'fs';
import path from 'path';
import {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByQuery
} from '../services/employee.service.js';

const capitalizeWords = (str) => {
    return str
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
};

export const createEmployeeController = async (req, res) => {
    try {
        const employeeData = { ...req.body };

        // Capitalize name
        if (employeeData.name) {
            employeeData.name = capitalizeWords(employeeData.name);
        }

        // Parse stringified JSON fields
        if (employeeData.parents) {
            employeeData.parents = JSON.parse(employeeData.parents);
        }

        if (employeeData.children) {
            employeeData.children = JSON.parse(employeeData.children);
        }

        if (employeeData.spouseParents) {
            employeeData.spouseParents = JSON.parse(employeeData.spouseParents);
        }

        if (employeeData.spouseChildren) {
            employeeData.spouseChildren = JSON.parse(employeeData.spouseChildren);
        }

        if (req.file) {
            employeeData.profilePicture = req.file.filename;
        }

        const employee = await createEmployee(employeeData);
        res.status(201).json({ success: true, message: 'Employee created', data: employee });
    } catch (err) {
        console.error('Create Employee Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};



export const updateEmployeeController = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedData = { ...req.body };

        if (updatedData.parents) {
            updatedData.parents = JSON.parse(updatedData.parents);
        }

        if (updatedData.children) {
            updatedData.children = JSON.parse(updatedData.children);
        }

        if (req.file) {
            // Delete old picture
            const old = await getEmployeesByQuery({ _id: id });
            const oldFile = old[0]?.profilePicture;
            if (oldFile) {
                const filePath = path.join('src', 'uploads', oldFile);
                fs.existsSync(filePath) && fs.unlinkSync(filePath);
            }

            updatedData.profilePicture = req.file.filename;
        }

        const updated = await updateEmployee(id, updatedData);
        res.status(200).json({ success: true, message: 'Employee updated', data: updated });
    } catch (err) {
        console.error('Update Employee Error:', err);
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


