import axios from 'axios';

export const checkAuth = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/check-auth`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Error checking authentication:', error);
        throw error;
    }
}