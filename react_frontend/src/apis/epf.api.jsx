import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const updateMaxEpf = async (data) => {
    try {
        // Handle both old format (just maxEpf number) and new format (object with maxEpf and ranges)
        const payload = typeof data === 'number' ? { maxEpf: data } : data;

        const response = await axios.post(`${API_BASE_URL}/epf/max`, payload, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error updating max EPF:", error);
        throw error;
    }
};

export const getMaxEpf = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/epf/max`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching max EPF:", error);
        throw error;
    }
};

export const getEmpEpf = async (query = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/epf/emp`, {
            params: query,
            withCredentials: true
        });

        return response.data;
    } catch (err) {
        console.error("Error fetching employee EPF:", err);

        const message =
            err.response?.data?.message || "Failed to fetch employee EPF records.";
        throw new Error(message);
    }
};

export const createOrUpdateEmployeeEpf = async (data, method = "update") => {
    try {
        const payload = { ...data, method };

        const response = await axios.post(`${API_BASE_URL}/epf/emp`, payload, {
            withCredentials: true
        });

        return response.data;
    } catch (err) {
        console.error("Error creating/updating employee EPF:", err);
        const message = err.response?.data?.message || "Failed to create/update employee EPF.";
        throw new Error(message);
    }
};


export const deleteEmployeeEpf = async (epfId, { type, createdAt, rangeName }) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/epf/emp/${epfId}`, {
            withCredentials: true,
            data: {
                type,
                createdAt,
                rangeName
            }
        });
        return response.data;
    } catch (err) {
        console.error("Error deleting employee EPF expense:", err);
        const message = err.response?.data?.message || "Failed to delete employee EPF expense.";
        throw new Error(message);
    }
};

