import Employee from '../models/employee.model.js';
import mongoose from 'mongoose';
import EmployeeEpf from '../models/employeeEpf.model.js';

export const createEmployee = async (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid employee data");
    }

    // Recursively sanitize values
    const sanitize = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        } else if (obj !== null && typeof obj === "object") {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [key, sanitize(value)])
            );
        } else {
            // Handle bad values
            if (obj === undefined || obj === null) return null;
            if (typeof obj === "string") {
                if (obj.trim().toLowerCase() === "undefined") return null;
                if (obj.trim() === "") return null;
            }
            return obj;
        }
    };

    const sanitizedData = sanitize(data);

    try {
        return await Employee.create(sanitizedData);
    } catch (err) {
        throw new Error(`Failed to create employee: ${err.message}`);
    }
};


export const updateEmployee = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid employee ID");
    }

    if (!data || typeof data !== "object") {
        throw new Error("No update data provided");
    }

    // Recursively sanitize values
    const sanitize = (obj, schema) => {
        if (Array.isArray(obj)) {
            return obj.map(item => sanitize(item, schema));
        } else if (obj !== null && typeof obj === "object") {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => {
                    const schemaType = schema?.paths?.[key]?.instance;
                    return [key, sanitize(value, schemaType)];
                })
            );
        } else {
            // Handle bad values
            if (obj === undefined || obj === null) return null;

            if (typeof obj === "string") {
                const trimmed = obj.trim().toLowerCase();
                if (trimmed === "" || trimmed === "undefined" || trimmed === "null") return null;

                // Convert numeric strings to actual numbers for Number fields
                if (schema === "Number" && !isNaN(Number(obj))) return Number(obj);
            }

            // If schema type is Number but value is still not a number, set null
            if (schema === "Number" && typeof obj !== "number") return null;

            return obj;
        }
    };


    try {
        // Sanitize incoming data
        const sanitizedData = sanitize(data);

        // Special case: profilePicture — extract filename if full URL is passed
        if (sanitizedData.profilePicture && typeof sanitizedData.profilePicture === "string") {
            sanitizedData.profilePicture = sanitizedData.profilePicture.includes("/")
                ? sanitizedData.profilePicture.split("/").pop()
                : sanitizedData.profilePicture;
        }

        const updated = await Employee.findByIdAndUpdate(id, sanitizedData, {
            new: true,
            runValidators: true,
        });

        if (!updated) throw new Error("Employee not found for update");
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
