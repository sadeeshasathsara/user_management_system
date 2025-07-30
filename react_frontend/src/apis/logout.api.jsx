import axios from 'axios';

export const logoutApi = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/logout`, { withCredentials: true });

        if (response.data.success) {
            window.location.href = '/login'
        }
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};