import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Users,
    Shield,
    Settings,
    Camera,
    Lock,
    Building,
    DollarSign,
    Heart,
    UserCheck,
    Baby,
    X,
    Eye,
    EyeOff,
    Check,
    AlertCircle
} from 'lucide-react';

// Import the actual functions
import { useUserStore } from '../tools/user.zustand';
import { getEmployeesApi } from '../apis/employee.api';
import TabHeader from '../components/TabHeader';
import ForgotPassword from '../components/forgot_password';
import { updatePassword } from '../apis/recovery.api';


// Component 1: Profile Header
const ProfileHeader = ({ adminData, onChangePassword }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="border-2 border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                <div className="relative mb-4 sm:mb-0 flex-shrink-0">
                    <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden">
                        {adminData?.profilePicture && !adminData.profilePicture.includes('/null') ? (
                            <img
                                src={adminData.profilePicture}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <button className="absolute -bottom-1 -right-1 border border-gray-200 rounded-full p-1.5 hover:border-gray-300 transition-colors">
                        <Camera className="w-3 h-3 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 truncate">
                                {adminData?.name || 'Admin User'}
                            </h1>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                <Shield className="w-4 h-4 mr-1" />
                                Administrator
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Member since {adminData?.joinedDate ? formatDate(adminData.joinedDate) : 'N/A'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                            <button
                                onClick={onChangePassword}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-md transition-colors"
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                Change Password
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component 2: Personal Information Card
const PersonalInfoCard = ({ adminData }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-600" />
                    Personal Information
                </h2>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-900 font-medium mt-1">{adminData?.name || 'N/A'}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Gender</label>
                        <p className="text-gray-900 mt-1">{adminData?.gender || 'N/A'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.email || 'N/A'}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.contactNumber || 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">NIC Number</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.nicNumber || 'N/A'}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Marital Status</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <Heart className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.maritalStatus || 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.dateOfBirth ? formatDate(adminData.dateOfBirth) : 'N/A'}
                            {adminData?.dateOfBirth && (
                                <span className="ml-2 text-sm text-gray-500">
                                    ({calculateAge(adminData.dateOfBirth)} years old)
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <div className="flex items-start text-gray-900 mt-1">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1 flex-shrink-0" />
                            <span className="whitespace-pre-line">{adminData?.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component 3: Employment Information Card
const EmploymentInfoCard = ({ adminData }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount).replace('LKR', 'Rs.');
    };

    return (
        <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-gray-600" />
                    Employment Information
                </h2>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">EPF Number</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.epfNumber || 'N/A'}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.department || 'Administration'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Employment Type</label>
                        <div className="flex items-center mt-1">
                            <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${adminData?.employmentType === 'Permanent'
                                ? 'border-green-200 text-green-800'
                                : 'border-yellow-200 text-yellow-800'
                                }`}>
                                {adminData?.employmentType || 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Account Status</label>
                        <div className="flex items-center mt-1">
                            <span className="w-2 h-2 border border-green-400 rounded-full mr-2"></span>
                            <span className="text-green-700 text-sm font-medium">Active</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Joined Date</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.joinedDate ? formatDate(adminData.joinedDate) : 'N/A'}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500">Basic Salary</label>
                        <div className="flex items-center text-gray-900 mt-1">
                            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                            {adminData?.basicSalary ? formatSalary(adminData.basicSalary) : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component 4: Family Information Card
const ChangePasswordModal = ({ isOpen, onClose, forgotClicked }) => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [validations, setValidations] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        passwordsMatch: false
    });

    const [touched, setTouched] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Real-time password validation
    useEffect(() => {
        const newPassword = passwords.new;

        setValidations({
            minLength: newPassword.length >= 8,
            hasUppercase: /[A-Z]/.test(newPassword),
            hasLowercase: /[a-z]/.test(newPassword),
            hasNumber: /\d/.test(newPassword),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
            passwordsMatch: passwords.new === passwords.confirm && passwords.new.length > 0
        });
    }, [passwords.new, passwords.confirm]);

    const handlePasswordChange = (field, value) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
        if (!touched[field]) {
            setTouched(prev => ({ ...prev, [field]: true }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const isFormValid = () => {
        return passwords.current.length > 0 &&
            Object.values(validations).every(Boolean);
    };

    const handleSubmit = async (e) => {
        if (!isFormValid()) return;

        setIsSubmitting(true);

        const res = await updatePassword(passwords.confirm)

        console.log('Password change submitted');
        setIsSubmitting(false);
        onClose();

        // Reset
        setPasswords({ current: '', new: '', confirm: '' });
        setTouched({ current: false, new: false, confirm: false });
    };

    const ValidationItem = ({ isValid, text }) => (
        <div className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${isValid ? 'text-green-600' : 'text-gray-500'
            }`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${isValid
                ? 'bg-green-100 border border-green-300'
                : 'bg-gray-100 border border-gray-300'
                }`}>
                {isValid && <Check className="w-2.5 h-2.5 text-green-600" />}
            </div>
            <span className={isValid ? 'font-medium' : ''}>{text}</span>
        </div>
    );

    if (!isOpen) return null;



    return (
        <>

            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="relative p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                                <p className="text-sm text-gray-500">Update your account security</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwords.current}
                                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                                    onBlur={() => handleBlur('current')}
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${touched.current && passwords.current.length === 0
                                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                                        : 'border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white'
                                        }`}
                                    placeholder="Enter your current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {touched.current && passwords.current.length === 0 && (
                                <p className="text-sm text-red-600 flex items-center space-x-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Current password is required</span>
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwords.new}
                                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                                    onBlur={() => handleBlur('new')}
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${touched.new && passwords.new.length > 0
                                        ? Object.values(validations).slice(0, 5).every(Boolean)
                                            ? 'border-green-300 focus:border-green-500 bg-green-50'
                                            : 'border-amber-300 focus:border-amber-500 bg-amber-50'
                                        : 'border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white'
                                        }`}
                                    placeholder="Enter your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        {(touched.new || passwords.new.length > 0) && (
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Password Requirements</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    <ValidationItem isValid={validations.minLength} text="At least 8 characters" />
                                    <ValidationItem isValid={validations.hasUppercase} text="One uppercase letter" />
                                    <ValidationItem isValid={validations.hasLowercase} text="One lowercase letter" />
                                    <ValidationItem isValid={validations.hasNumber} text="One number" />
                                    <ValidationItem isValid={validations.hasSpecialChar} text="One special character" />
                                </div>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwords.confirm}
                                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                                    onBlur={() => handleBlur('confirm')}
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${touched.confirm && passwords.confirm.length > 0
                                        ? validations.passwordsMatch
                                            ? 'border-green-300 focus:border-green-500 bg-green-50'
                                            : 'border-red-300 focus:border-red-500 bg-red-50'
                                        : 'border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white'
                                        }`}
                                    placeholder="Confirm your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {touched.confirm && passwords.confirm.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    {validations.passwordsMatch ? (
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <Check className="w-4 h-4" />
                                            <span className="text-sm font-medium">Passwords match</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 text-red-600">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm">Passwords don't match</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <button
                                onClick={() => forgotClicked(true)}
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                            >
                                Forgot your current password?
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!isFormValid() || isSubmitting}
                                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${isFormValid() && !isSubmitting
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Updating...</span>
                                    </div>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const FamilyInfoCard = ({ adminData }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-600" />
                    Family Information
                </h2>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Spouse Information */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        Spouse Information
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-600">
                            {adminData?.spouseName || 'No spouse information available'}
                        </p>
                    </div>
                </div>

                {/* Parents Information */}
                {adminData?.parents && adminData.parents.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Parents Information
                        </h3>
                        <div className="space-y-3">
                            {adminData.parents.map((parent, index) => (
                                <div key={parent._id || index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{parent.name}</p>
                                            <p className="text-sm text-gray-600">{parent.relationship}</p>
                                        </div>
                                        <div className="mt-2 sm:mt-0">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 mr-1" />
                                                {parent.contactNumber}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Children Information */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Baby className="w-4 h-4 mr-1" />
                        Children Information
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-600">
                            {adminData?.children && adminData.children.length > 0
                                ? `${adminData.children.length} children`
                                : 'No children information available'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component 6: Main Profile Page
const AdminProfilePage = ({ currentPath }) => {
    const { user, setUser } = useUserStore();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getEmployeesApi({ email: user.email });
                if (response.success && response.data.length > 0) {
                    setAdminData(response.data[0]);
                } else {
                    setError('No admin data found');
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setError('Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchAdminData();
        } else {
            setLoading(false);
            setError('No user email found');
        }
    }, [user?.email]);

    const handleChangePassword = () => {
        setIsPasswordModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="text-red-600 text-lg font-medium mb-2">Error</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='z-[60]'>
                <ForgotPassword
                    show={showForgotPassword}
                    onClose={() => setShowForgotPassword(false)}
                />
            </div>
            <div className="p-6 space-y-6">
                <ProfileHeader
                    adminData={adminData}
                    onChangePassword={handleChangePassword}
                />

                <div className="space-y-6">
                    <PersonalInfoCard adminData={adminData} />
                    <EmploymentInfoCard adminData={adminData} />
                    <FamilyInfoCard adminData={adminData} />
                </div>

                <ChangePasswordModal
                    forgotClicked={() => setShowForgotPassword(true)}
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                />
            </div>
        </>
    );
};

export default AdminProfilePage;