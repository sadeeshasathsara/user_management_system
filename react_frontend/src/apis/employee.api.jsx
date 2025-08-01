import axios from 'axios';

const API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/emp`;

/**
 * Create a new employee (supports profile picture upload)
 * @param {Object} data - Form data (including profilePicture as File)
 */
export const createEmployeeApi = async (data = {}) => {
    try {
        const formData = new FormData();

        for (const key in data) {
            if (key === 'profilePicture' && data[key] instanceof File) {
                formData.append('profilePicture', data[key]);
            } else {
                formData.append(key, data[key]);
            }
        }

        const res = await axios.post(API, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return res.data;
    } catch (err) {
        console.error('Create Employee Error:', err);
        throw err.response?.data || { message: err.message };
    }
};

/**
 * Update an employee by ID (supports profile picture update)
 * @param {string} id - Employee ID
 * @param {Object} data - Updated fields, including profilePicture (File)
 */
export const updateEmployeeApi = async (id, data = {}) => {
    try {
        const formData = new FormData();

        for (const key in data) {
            if (key === 'profilePicture' && data[key] instanceof File) {
                formData.append('profilePicture', data[key]);
            } else {
                formData.append(key, data[key]);
            }
        }

        const res = await axios.put(`${API}/${id}`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return res.data;
    } catch (err) {
        console.error('Update Employee Error:', err);
        throw err.response?.data || { message: err.message };
    }
};

/**
 * Delete an employee by ID
 * @param {string} id - Employee ID
 */
export const deleteEmployeeApi = async (id) => {
    try {
        const res = await axios.delete(`${API}/${id}`, {
            withCredentials: true
        });

        return res.data;
    } catch (err) {
        console.error('Delete Employee Error:', err);
        throw err.response?.data || { message: err.message };
    }
};

/**
 * Get employees by optional filters (department, name, etc.)
 * @param {Object} query - Query params object
 */
export const getEmployeesApi = async (query = {}) => {
    try {
        const queryString = new URLSearchParams(query).toString();
        const res = await axios.get(`${API}?${queryString}`, {
            withCredentials: true
        });

        return res.data;
    } catch (err) {
        console.error('Get Employees Error:', err);
        throw err.response?.data || { message: err.message };
    }
};
