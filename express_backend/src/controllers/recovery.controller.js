import { isOtpVerified, sendOtp, validateOtp } from "../services/otp.service.js";
import { getAdmins, updatePassword } from "../services/register.service.js";

export const accountRecoveryController = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Optional: Check if the email exists first
        const admins = await getAdmins({ email });
        const admin = Array.isArray(admins) ? admins[0] : admins;

        if (!admin) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (!admin.isActive) {
            return res.status(403).json({ message: "Account is disabled" });
        }

        // Send OTP
        await sendOtp(admin.name, email);

        return res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (e) {
        console.error("Account recovery error:", e);
        res.status(500).json({ message: e.message });
    }
};

export const validateOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const result = await validateOtp(email, otp);

        if (result === true) {
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ message: result });
        }
    } catch (e) {
        console.error("OTP validation error:", e);
        return res.status(500).json({ message: e.message });
    }
};

export const recoveryUpdatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email or password is missing' });
        }

        const verified = await isOtpVerified(email);
        if (!verified) {
            return res.status(401).json({ message: 'OTP not verified or expired' });
        }

        const response = await updatePassword(email, password);
        if (response?.success !== true) {
            return res.status(500).json({ message: 'Failed to update password' });
        }

        return res.status(200).json({ success: true, message: 'Password updated successfully', success: true });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

export const updatePasswordController = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.user.email;


        if (!email) return res.status(404).json({ message: "Email is missing" });
        if (!password) return res.status(404).json({ message: "Password is missing" });

        const response = await updatePassword(email, password);

        if (response?.success != true) return res.status(500).json({ message: 'Failed to update the password. Something went wrong' });

        return res.status(200).json({ success: true, message: 'Password updated' })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}