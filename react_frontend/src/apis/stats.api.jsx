import axios from 'axios';

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

// Include credentials if you’re using cookies for auth
const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
});

// Fetch general stats
export const getStatsApi = async () => {
    try {
        const res = await axiosInstance.get('/stats');
        return res.data;
    } catch (err) {
        console.error('Failed to fetch stats:', err);
        return { success: false, message: err.message };
    }
};

// Fetch department-wise employee stats
export const getDepartmentStatsApi = async () => {
    try {
        const res = await axiosInstance.get('/stats/dep');
        return res.data;
    } catch (err) {
        console.error('Failed to fetch department stats:', err);
        return { success: false, message: err.message };
    }
};

// Fetch EPF monthly contribution stats
export const getEpfMonthlyContributionApi = async () => {
    try {
        const res = await axiosInstance.get('/stats/epf');
        return res.data;
    } catch (err) {
        console.error('Failed to fetch EPF monthly contribution:', err);
        return { success: false, message: err.message };
    }
};
