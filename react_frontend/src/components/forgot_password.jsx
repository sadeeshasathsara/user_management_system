import React, { useState, useEffect } from 'react';
import { Mail, Shield, ArrowLeft, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const ForgotPassword = ({ show, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Success
    const [formData, setFormData] = useState({
        email: '',
        otp: ['', '', '', '', '', '']
    });
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');

    // Reset state when modal opens
    React.useEffect(() => {
        if (show) {
            setCurrentStep(1);
            setFormData({ email: '', otp: ['', '', '', '', '', ''] });
            setError('');
            setCountdown(0);
            setIsLoading(false);
        }
    }, [show]);

    // Countdown timer for resend OTP
    React.useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Close modal on escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && show) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [show, onClose]);

    const handleEmailChange = (e) => {
        setFormData(prev => ({ ...prev, email: e.target.value }));
        setError('');
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;

        const newOtp = [...formData.otp];
        newOtp[index] = value;
        setFormData(prev => ({ ...prev, otp: newOtp }));
        setError('');

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setIsLoading(false);
            setCurrentStep(2);
            setCountdown(60);
        }, 2000);
    };

    const handleVerifyOtp = async () => {
        const otpValue = formData.otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setIsLoading(false);
            if (otpValue === '123456') {
                setCurrentStep(3);
            } else {
                setError('Invalid OTP. Please try again.');
            }
        }, 2000);
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setIsLoading(false);
            setCountdown(60);
            setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
        }, 1000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
                <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-center relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors duration-200 z-20"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>

                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="flex items-center space-x-4">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${currentStep >= step
                                                ? 'bg-white text-blue-600'
                                                : 'bg-white bg-opacity-30 text-white'
                                                }`}>
                                                {currentStep > step ? '✓' : step}
                                            </div>
                                            {step < 3 && (
                                                <div className={`w-8 h-0.5 transition-all duration-300 ${currentStep > step ? 'bg-white' : 'bg-white bg-opacity-30'
                                                    }`}></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                {currentStep === 1 && <Mail className="w-8 h-8 text-white" />}
                                {currentStep === 2 && <Shield className="w-8 h-8 text-white" />}
                                {currentStep === 3 && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2">
                                {currentStep === 1 && "Reset Password"}
                                {currentStep === 2 && "Verify OTP"}
                                {currentStep === 3 && "Success!"}
                            </h1>

                            <p className="text-blue-100 text-sm">
                                {currentStep === 1 && "Enter your email to receive a reset code"}
                                {currentStep === 2 && "Enter the 6-digit code sent to your email"}
                                {currentStep === 3 && "Password reset instructions have been sent"}
                            </p>
                        </div>
                    </div>

                    <div className="px-8 py-8">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="Enter your registered email"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleSendOtp}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-600">We've sent a 6-digit code to</p>
                                    <p className="text-sm font-medium text-gray-900">{formData.email}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block text-center">
                                        Enter Verification Code
                                    </label>
                                    <div className="flex justify-center space-x-3">
                                        {formData.otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="text-center">
                                    {countdown > 0 ? (
                                        <div className="flex items-center justify-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Resend OTP in {formatTime(countdown)}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleResendOtp}
                                            disabled={isLoading}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center justify-center mx-auto"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Resend OTP
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                <div className="text-center">
                                    <p className="text-xs text-gray-500">
                                        Demo: Use <span className="font-mono bg-gray-100 px-1 rounded">123456</span> as OTP
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="text-center space-y-6">
                                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        OTP Verified Successfully!
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Password reset instructions have been sent to your email address.
                                        Please check your inbox and follow the instructions to reset your password.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                    >
                                        Close
                                    </button>

                                    <p className="text-xs text-gray-500">
                                        Didn't receive the email? Check your spam folder or contact support.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .bg-grid-pattern {
                    background-image: radial-gradient(circle, #3b82f6 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                
                /* Custom Scrollbar Styles */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(243, 244, 246, 0.5);
                    border-radius: 10px;
                    margin: 8px 0;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(37, 99, 235, 0.6));
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(37, 99, 235, 0.8));
                    transform: scale(1.1);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:active {
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.7), rgba(29, 78, 216, 0.9));
                }
                
                .custom-scrollbar::-webkit-scrollbar-corner {
                    background: transparent;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;