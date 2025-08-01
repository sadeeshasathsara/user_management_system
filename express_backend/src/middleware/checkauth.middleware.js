import jwt from 'jsonwebtoken';

export const verifyAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized 1.0',
            message: 'Session expired'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded.id,
            email: decoded.email
        };
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized 1.1',
            message: 'Session expired'
        });
    }
};
