import axios from "axios";

export const getAdmins = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admins`, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.log(e);
        return e.message;
    }
}

export const addAdmin = async (formData) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/register`, formData, { withCredentials: true })
        return res.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
}

export const tougleAccountStatus = async (_id) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admins`, { _id }, { withCredentials: true })
        return res.data
    } catch (err) {
        console.log(e);
        return e.message;
    }
}

export const deleteAccount = async (_id) => {
    try {
        const res = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/admins`,
            {
                data: { _id },
                withCredentials: true
            }
        );
        return res.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
};
