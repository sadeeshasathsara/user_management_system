import Admin from '../models/admin.model.js';
import bcrypt from 'bcryptjs';

export const registerAdmin = async ({ email, password, epfNo }) => {
    // Check if admin exists by email or epfNo
    const existingAdmin = await Admin.findOne({
        $or: [{ email }, { epfNo }]
    });

    if (existingAdmin) {
        throw new Error('Admin with this email or EPF number already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new admin
    const newAdmin = new Admin({
        email,
        password: hashedPassword,
        epfNo,
    });

    // Save to DB
    await newAdmin.save();

    return newAdmin;
};

export const updatePassword = async (email, password) => {
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) throw new Error('Account not found (2.0)');

        const hashedPassword = await bcrypt.hash(password, 10);
        admin.password = hashedPassword;

        await admin.save();
        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
};


export const getAdmins = async (query = {}) => {
    try {
        const admins = await Admin.find(query);
        return admins;
    } catch (error) {
        throw new Error('Error fetching admins: ' + error.message);
    }
};
