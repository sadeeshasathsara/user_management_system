import React from 'react';
import '../autherror.css';

const AuthErrorModal = ({
    isOpen,
    errorCode,
    errorMessage,
    onTimeout
}) => {
    const [countdown, setCountdown] = React.useState(10);

    // Debug logging
    React.useEffect(() => {
        if (isOpen) {
            console.log('AuthErrorModal opened with:', { isOpen, errorCode, errorMessage });
        }
    }, [isOpen, errorCode, errorMessage]);

    React.useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                console.log('Countdown tick:', prev);
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onTimeout]);

    React.useEffect(() => {
        if (isOpen) {
            setCountdown(10); // Reset countdown when modal opens
            console.log('Modal opened, countdown reset to 10');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getErrorDetails = () => {
        switch (errorCode) {
            case 'Unauthorized 1.0':
                return {
                    title: '🔒 Session Expired',
                    description: 'Your admin session has expired for security reasons.',
                    reason: 'This happens automatically after a period of inactivity to protect your account.',
                    action: 'You will be redirected to login to continue.'
                };
            case 'Unauthorized 1.1':
                return {
                    title: '❌ Invalid Admin Account',
                    description: 'Your admin account could not be verified in our system.',
                    reason: 'This may occur if your account has been removed or there\'s a system configuration issue.',
                    action: 'Please contact your system administrator for assistance.'
                };
            case 'Unauthorized 1.2':
                return {
                    title: '🚫 Account Disabled',
                    description: 'Your admin account has been temporarily disabled.',
                    reason: 'Account access has been restricted by an administrator.',
                    action: 'Please contact your system administrator to reactivate your account.'
                };
            case 'Unauthorized 1.3':
                return {
                    title: '⚠️ Invalid Session',
                    description: 'Your authentication token is invalid or corrupted.',
                    reason: 'This can happen due to browser issues, network problems, or security token corruption.',
                    action: 'You will be redirected to login with a fresh session.'
                };
            default:
                return {
                    title: '🔐 Authentication Error',
                    description: 'There was a problem with your admin authentication.',
                    reason: errorMessage || 'An unexpected authentication error occurred.',
                    action: 'You will be redirected to login to resolve this issue.'
                };
        }
    };

    const errorDetails = getErrorDetails();

    const closeModel = () => {
        window.location.href = "/login"
    }

    return (
        <div className="auth-error-overlay">

            <div className="auth-error-backdrop" />
            <div className="auth-error-modal rounded">
                <div onClick={closeModel} className='font-bold absolute right-3 top-2 cursor-pointer rounded-full text-red-500 '>X</div>
                <div className="auth-error-header">
                    <div className="auth-error-icon">
                        <div className="pulse-ring"></div>
                        <div className="error-symbol">!</div>
                    </div>
                    <h2 className="auth-error-title">{errorDetails.title}</h2>
                    <p className="auth-error-subtitle">Admin Authentication Required</p>
                </div>

                <div className="auth-error-content">
                    <div className="error-section">
                        <h3>What happened?</h3>
                        <p>{errorDetails.description}</p>
                    </div>

                    <div className="error-section">
                        <h3>Why did this occur?</h3>
                        <p>{errorDetails.reason}</p>
                    </div>

                    <div className="error-section">
                        <h3>What happens next?</h3>
                        <p>{errorDetails.action}</p>
                    </div>

                    <div className="error-code-section">
                        <span className="error-code">Error Code: {errorCode || 'AUTH_ERROR'}</span>
                    </div>
                </div>

                <div className="auth-error-footer">
                    <div className="countdown-section">
                        <div className="countdown-circle">
                            <div className="countdown-number">{countdown}</div>
                            <svg className="countdown-ring" width="60" height="60">
                                <circle
                                    cx="30"
                                    cy="30"
                                    r="25"
                                    stroke="#e5e7eb"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <circle
                                    cx="30"
                                    cy="30"
                                    r="25"
                                    stroke="#dc2626"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeLinecap="round"
                                    style={{
                                        strokeDasharray: `${2 * Math.PI * 25}`,
                                        strokeDashoffset: `${2 * Math.PI * 25 * (1 - (countdown / 10))}`,
                                        transition: 'stroke-dashoffset 1s linear'
                                    }}
                                />
                            </svg>
                        </div>
                        <p>Redirecting to login in {countdown} seconds...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthErrorModal;