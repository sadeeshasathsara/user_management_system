import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const loginApi = async (formData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            emailOrEpf: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe
        }, { withCredentials: true });

        return response.data;
    }
    catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};