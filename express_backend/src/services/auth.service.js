import Admin from "../models/admin.model.js";
import bcrypt from 'bcryptjs';

export const validateUser = async (email = '', epf = '', password) => {
    try {
        let admin = null;

        if (email) {
            admin = await Admin.findOne({ email });
        } else if (epf) {
            admin = await Admin.findOne({ epfNo: Number(epf) });
        }

        if (!admin) {
            return null;
        }

        const isMatched = await bcrypt.compare(password, admin.password);
        if (!isMatched) {
            return null;
        }

        return {
            _id: admin._id,
            email: admin.email,
            epfNo: admin.epfNo
        };

    } catch (e) {
        console.error("Validation Error:", e);
        return null;
    }
};

export const tougleAccountStatus = async (accId) => {
    try {
        const admin = await Admin.findById(accId);
        if (!admin) {
            throw new Error('Account not found');
        }
        if (admin.isActive) {
            admin.isActive = false;
        } else {
            admin.isActive = true;
        }

        await admin.save();

        return {
            success: true,
            data: accId
        }
    } catch (e) {
        throw new Error(e.message)
    }
}

export const deleteAccount = async (accId) => {
    try {
        const admin = await Admin.findByIdAndDelete(accId);
        return {
            success: true,
            data: accId
        }
    } catch (e) {
        throw new Error(e.message)
    }
}