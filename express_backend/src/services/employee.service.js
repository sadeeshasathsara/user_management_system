import Employee from '../models/employee.model.js';
import mongoose from 'mongoose';
import EmployeeEpf from '../models/employeeEpf.model.js';

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
        const updateData = {};

        // Filter out undefined or null fields
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                // Special case: profilePicture — extract filename if full URL is passed
                if (key === 'profilePicture' && typeof data[key] === 'string') {
                    updateData[key] = data[key].includes('/') ? data[key].split('/').pop() : data[key];
                } else {
                    updateData[key] = data[key];
                }
            }
        }

        const updated = await Employee.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

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
        if (!deleted) {
            throw new Error('Employee not found for deletion');
        }

        const deletedEpfRecords = await EmployeeEpf.deleteMany({ user: id });

        return deleted;
    } catch (err) {
        throw new Error(`Failed to delete employee: ${err.message}`);
    }
};


export const getEmployeesByQuery = async (query) => {
    try {
        const baseUrl = process.env.EXPRESS_URL || 'http://localhost:5000';

        // Extract search term and remove it from query
        const { search, ...otherFilters } = query;
        const mongoQuery = { ...otherFilters };

        // If search is present, add case-insensitive OR conditions
        if (search) {
            const regex = new RegExp(search, 'i');
            mongoQuery.$or = [
                { name: regex },
                { epfNumber: regex },
                { address: regex },
                { nicNumber: regex },
                { gender: regex },
                { email: regex },
                { employmentType: regex },
                { contactNumber: regex }
                // You can’t search department name here directly unless you use aggregation
            ];
        }

        const results = await Employee.find(mongoQuery).populate('department');

        const updatedResults = results.map((emp) => {
            const empObj = emp.toObject();
            if (empObj.profilePicture) {
                empObj.profilePicture = `${baseUrl}/prop/${empObj.profilePicture}`;
            }
            return empObj;
        });

        return updatedResults;
    } catch (err) {
        throw new Error(`Failed to fetch employees: ${err.message}`);
    }
};
