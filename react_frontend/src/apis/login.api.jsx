import axios from 'axios';

export const loginApi = async (formData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/login`, {
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