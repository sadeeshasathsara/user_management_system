import axios from 'axios';

export const checkAuth = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/check-auth`, { withCredentials: true });
        if (res.data.success) {
            return res.data;
        } else {
            return res.data.message;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        throw error;
    }
}