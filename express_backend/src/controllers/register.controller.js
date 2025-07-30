import { registerAdmin } from "../services/register.service.js";

export const registerController = async (req, res) => {
    const { email, password, epfNo } = req.body;

    if (!email || !password || !epfNo) {
        return res.status(400).json({ message: 'Email, password and EPF number are required' });
    }

    try {
        const admin = await registerAdmin({ email, password, epfNo });
        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                email: admin.email,
                epfNo: parseInt(admin.epfNo),
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
};
