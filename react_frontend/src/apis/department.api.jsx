import axios from 'axios';

export const fetchDepartmentsApi = async (query = {}) => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/department`,
            {
                params: query,
                withCredentials: true
            }
        );
        return res.data;
    } catch (e) {
        console.log(e);
        return e.message;
    }
};


export const updateDepartment = async (formData = {}) => {
    try {
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/department/${formData._id}`, formData, {
            withCredentials: true
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return e.message;
    }
}

export const deleteDepartment = async (_id) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/department/${_id}`, {
            withCredentials: true
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return e.message;
    }
}

export const createDepartment = async (formData = {}) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/department`, formData, {
            withCredentials: true
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return e.message;
    }
}