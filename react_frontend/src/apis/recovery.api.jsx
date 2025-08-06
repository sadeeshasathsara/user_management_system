import axios from 'axios';

const URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

// ✅ 1. Send OTP to email
export const sendEmailApi = async (email) => {
    try {
        const res = await axios.post(`${URL}/recovery/otp`, email);
        return res.data;
    } catch (e) {
        console.error(e);
        return e?.response?.data?.message || e.message;
    }
};

// ✅ 2. Validate OTP
export const validateOtpApi = async (payload) => {
    try {
        const res = await axios.post(`${URL}/recovery/validate-otp`, payload);
        return res.data;
    } catch (e) {
        console.error(e);
        return e?.response?.data?.message || e.message;
    }
};

// ✅ 3. Update password
export const updateRecoveryPasswordApi = async (payload) => {
    try {
        const res = await axios.post(`${URL}/recovery/update-pwd`, payload);
        return res.data;
    } catch (e) {
        console.error(e);
        return e?.response?.data?.message || e.message;
    }
};

export const updatePassword = async (password) => {
    try {
        const res = await axios.put(`${URL}/update-pwd`, { password }, { withCredentials: true });
        return res.data;
    } catch (e) {
        console.log(e);
        return e;
    }
}