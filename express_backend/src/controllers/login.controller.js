import jwt from 'jsonwebtoken';
import { validateUser } from '../services/auth.service.js';

export const loginController = async (req, res) => {
    const { emailOrEpf, password, rememberMe } = req.body;

    if (!emailOrEpf || !password) {
        return res.status(400).json({ message: 'Email/EPF and password are required' });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrEpf);

    try {
        const admin = isEmail
            ? await validateUser(emailOrEpf, '', password)
            : await validateUser('', emailOrEpf, password);

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (admin.isActive == false) {
            return res.status(401).json({ message: 'Account disabled.' })
        }

        // Set expiry based on rememberMe
        const expiresIn = rememberMe ? '7d' : '1d';
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // ms

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            admin
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
