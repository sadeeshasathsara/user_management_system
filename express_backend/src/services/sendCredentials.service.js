import { sendEmail } from './email.service.js';
import crypto from 'crypto';

export const sendCredentials = async ({ name, email, password }) => {

    const appUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const subject = '🎉 Your Account Credentials for UMS';
    const text = `Hi ${name}, your account has been created.\n\nLogin Email: ${email}\nPassword: ${password}\n\nVisit: ${appUrl}`;

    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 10px; background-color: #f5f7fa;">
    <div style="max-width: 100%; width: 100%; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white;">
            <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 10px; margin: 0 auto 15px; line-height: 50px; text-align: center; font-size: 20px; font-weight: bold;">U</div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 700;">UMS Dashboard</h1>
            <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">User Management System</p>
        </div>

        <!-- Content -->
        <div style="padding: 25px 20px;">
            
            <!-- Welcome Section -->
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 30px; margin-bottom: 10px;">🎉</div>
                <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 8px; font-weight: 600;">Welcome, ${name}!</h2>
                <p style="color: #718096; font-size: 15px; margin: 0;">Your account is ready. Here are your login details:</p>
            </div>

            <!-- Credentials - Mobile Optimized -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #2d3748; font-size: 16px; margin: 0 0 15px; font-weight: 600;">🔑 Login Details</h3>
                
                <!-- Email -->
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: 600; color: #4a5568; font-size: 14px; margin-bottom: 5px;">Email Address:</div>
                    <div style="background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 14px; color: #2d3748; word-break: break-word; overflow-wrap: break-word;">${email}</div>
                </div>
                
                <!-- Password -->
                <div style="margin-bottom: 0;">
                    <div style="font-weight: 600; color: #4a5568; font-size: 14px; margin-bottom: 5px;">Password:</div>
                    <div style="background: #fff5f5; padding: 12px; border-radius: 6px; border: 1px solid #feb2b2; font-family: monospace; font-size: 16px; color: #e53e3e; font-weight: 700; word-break: break-word; overflow-wrap: break-word; letter-spacing: 1px;">${password}</div>
                </div>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin: 25px 0;">
                <a href="${appUrl}" style="display: block; background: linear-gradient(135deg, #4299e1, #667eea); color: white; text-decoration: none; padding: 16px 20px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; box-shadow: 0 3px 10px rgba(66, 153, 225, 0.3);">
                    Access Dashboard →
                </a>
            </div>

            <!-- Security Notice -->
            <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                    <strong>🔒 Security:</strong> Change your password after first login for better security.
                </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #a0aec0; font-size: 12px; margin: 0; line-height: 1.4;">
                    Need help? Contact support<br>
                    © UMS Dashboard System
                </p>
            </div>
            
        </div>
    </div>
</div>
`;


    try {
        const emailResponse = await sendEmail({ to: email, subject: subject, text: text, html: html });
        return { emailResponse, password };
    } catch (error) {
        console.error('Error sending credentials:', error);
        throw new Error('Failed to send credentials');
    }
};
