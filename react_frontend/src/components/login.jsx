import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../apis/login.api';

// Professional Login UI Component
const LoginUI = ({ forgotClicked = () => { } }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear message when user starts typing
        if (message) {
            setMessage(null);
            setMessageType('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setMessageType('');

        try {
            const response = await loginApi(formData);
            if (response.success) {
                setMessage(response.message || 'Login successful!');
                setMessageType('success');
                navigate('/dashboard');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
            {/* Professional Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                {/* Geometric Shapes */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rotate-45 animate-ping"></div>
                <div className="absolute top-40 right-32 w-3 h-3 bg-indigo-400/60 rotate-45 animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-32 left-40 w-2 h-2 bg-purple-400/60 rotate-45 animate-ping" style={{ animationDelay: '3s' }}></div>
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-blue-400/60 rotate-45 animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Glass Morphism Container */}
            <div className="relative w-full max-w-sm z-10">
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header Section */}
                    <div className="relative px-6 py-6 text-center">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            {/* Logo Container */}
                            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20 shadow-lg">
                                <Shield className="w-7 h-7 text-blue-300" />
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                            <p className="text-blue-200/80 text-sm font-medium">Please sign in to your account</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="px-6 py-6 bg-white/5 backdrop-blur-sm">
                        <div className="space-y-4">
                            {/* Message Display */}
                            {message && (
                                <div className={`
                                    flex items-center gap-2 p-3 rounded-lg border backdrop-blur-sm transition-all duration-300 transform
                                    ${messageType === 'success'
                                        ? 'bg-green-500/20 border-green-400/30 text-green-200'
                                        : 'bg-red-500/20 border-red-400/30 text-red-200'
                                    }
                                `} style={{
                                        animation: 'messageSlideIn 0.3s ease-out'
                                    }}>
                                    <div className="flex-shrink-0">
                                        {messageType === 'success' ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium">{message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-xs font-semibold text-white/90 block">
                                    Email Address / EPF No
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-blue-500/70" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full outline-none pl-10 pr-3 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 bg-white/10 text-white placeholder-white/50 hover:bg-white/15 text-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <label htmlFor="password" className="text-xs font-semibold text-white/90 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-blue-500/70" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full outline-none pl-10 pr-12 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 bg-white/10 text-white placeholder-white/50 hover:bg-white/15 text-sm"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300/70 hover:text-blue-300 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="h-3 w-3 text-blue-400 focus:ring-blue-400/50 border-white/30 rounded bg-white/10 transition-colors duration-200"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 text-xs text-white/80 font-medium">
                                        Remember me
                                    </label>
                                </div>
                                <button
                                    onClick={forgotClicked}
                                    type="button"
                                    className="text-xs text-blue-300 hover:text-blue-200 font-semibold transition-colors duration-200 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-white/60 font-medium">
                        © 2025 UMS Dashboard. All rights reserved.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Custom scrollbar for the page */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.5);
                }
            `}</style>
        </div>
    );
};

export default LoginUI;