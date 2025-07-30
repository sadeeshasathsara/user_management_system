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
