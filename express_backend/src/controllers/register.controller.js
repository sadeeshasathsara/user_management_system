import { deleteAccount, tougleAccountStatus } from "../services/auth.service.js";
import { getEmployeesByQuery } from "../services/employee.service.js";
import { passwordGenerator } from "../services/passwordGenerator.service.js";
import { getAdmins, registerAdmin } from "../services/register.service.js";
import { sendCredentials } from "../services/sendCredentials.service.js";

export const registerController = async (req, res) => {
    const { email, password, epfNo } = req.body;
    let generatedPassword = null;

    if (!email || !epfNo) {
        return res.status(400).json({ message: 'Email and EPF number are required' });
    }

    if (!password) {
        generatedPassword = passwordGenerator();
    }

    try {
        const admin = await registerAdmin({ email, password: generatedPassword || password, epfNo });
        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                email: admin.email,
                epfNo: parseInt(admin.epfNo),
            },
        });
        const savedAdmin = await getEmployeesByQuery({ epfNo: epfNo })
        await sendCredentials({
            email,
            name: savedAdmin.name || 'New Admin',
            password: generatedPassword
        });

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message });
    }
};

export const getAdminsController = async (req, res) => {
    try {
        const admins = await getAdmins();
        res.status(200).json(admins);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error fetching admins' });
    }
};

export const tougleAccountStatusController = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) return res.status(403).json({ message: "ID is not provided" });

        const response = await tougleAccountStatus(_id);

        if (response.success != true) {
            return res.status(403).json({ message: "Something Went Wrong" })
        }

        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export const deleteAccountController = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) return res.status(403).json({ message: "ID is not provided" });

        const response = await deleteAccount(_id);

        if (response.success != true) {
            return res.status(403).json({ message: "Something Went Wrong" })
        }

        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}