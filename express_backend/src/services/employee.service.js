import Employee from '../models/employee.model.js';
import mongoose from 'mongoose';

export const createEmployee = async (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid employee data');
    }

    try {
        return await Employee.create(data);
    } catch (err) {
        throw new Error(`Failed to create employee: ${err.message}`);
    }
};

export const updateEmployee = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid employee ID');
    }

    if (!data || typeof data !== 'object') {
        throw new Error('No update data provided');
    }

    try {
        const updated = await Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!updated) throw new Error('Employee not found for update');
        return updated;
    } catch (err) {
        throw new Error(`Failed to update employee: ${err.message}`);
    }
};

export const deleteEmployee = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid employee ID');
    }

    try {
        const deleted = await Employee.findByIdAndDelete(id);
        if (!deleted) throw new Error('Employee not found for deletion');
        return deleted;
    } catch (err) {
        throw new Error(`Failed to delete employee: ${err.message}`);
    }
};

export const getEmployeesByQuery = async (query) => {
    try {
        const results = await Employee.find(query).populate('department');
        return results;
    } catch (err) {
        throw new Error(`Failed to fetch employees: ${err.message}`);
    }
};
