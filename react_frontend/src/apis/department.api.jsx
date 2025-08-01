import axios from 'axios';

export const fetchDepartmentsApi = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/department`, {
            withCredentials: true
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return e.message;
    }
}