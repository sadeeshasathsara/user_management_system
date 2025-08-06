import crypto from 'crypto';

/**
 * Generate a strong random password
 */
export const passwordGenerator = () => {
    return crypto.randomBytes(10).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
};