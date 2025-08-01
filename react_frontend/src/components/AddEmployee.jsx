import React, { useState, useEffect } from 'react';
import { User, Save, ArrowLeft, AlertCircle, CheckCircle, X, Plus, Trash2, Upload, Image } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import { createEmployeeApi } from '../apis/employee.api';
import { fetchDepartmentsApi } from '../apis/department.api';

const AddEmployeeForm = ({ onBack }) => {
    const [formData, setFormData] = useState({
        epfNumber: '',
        name: '',
        address: '',
        dateOfBirth: '',
        nicNumber: '',
        gender: '',
        email: '',
        department: '',
        joinedDate: '',
        basicSalary: '',
        employmentType: '',
        profilePicture: null,
        maritalStatus: 'Unmarried',
        spouseName: '',
        parents: [],
        children: [],
        contactNumber: ''
    });

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);

    // Mock departments data - replace with actual API call
    useEffect(() => {
        // Simulate API call to fetch departments
        const fetchDepartments = async () => {
            try {
                // Replace with actual API endpoint
                const response = await fetchDepartmentsApi();
                setDepartments(response.data);
            } catch (error) {
                showNotification('error', 'Failed to fetch departments');
            }
        };
        fetchDepartments();
    }, []);

    // Real-time validation functions
    const validateEpfNumber = (value) => {
        if (!value) return '';
        if (!/^\d{1,4}$/.test(value)) {
            return 'EPF Number must be exactly 4 digits';
        }
        return '';
    };

    const validateName = (value) => {
        if (!value) return '';
        if (value.length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            return 'Name can only contain letters and spaces';
        }
        return '';
    };

    const validateSriLankanNumber = (phoneNumber) => {
        if (!phoneNumber) return '';
        const digits = phoneNumber.replace(/\D/g, '');

        if (digits.startsWith('94')) {
            if (digits.length !== 11) {
                return 'Invalid Sri Lankan number. Should be exactly 9 digits after country code (947xxxxxxxx)';
            }
            // Check if the number after 94 is valid (should start with 7 and be exactly 9 digits)
            const localNumber = digits.substring(2);
            if (!localNumber.startsWith('7') || localNumber.length !== 9) {
                return 'Invalid Sri Lankan mobile number. Must be 9 digits starting with 7 after country code';
            }
        } else if (digits.startsWith('0')) {
            if (digits.length !== 10) {
                return 'Invalid Sri Lankan number. Should be 10 digits starting with 0';
            }
            // Check if it's a valid mobile number (07xxxxxxxx)
            if (!digits.startsWith('07')) {
                return 'Invalid Sri Lankan mobile number. Should start with 07';
            }
        } else {
            return 'Invalid Sri Lankan number format';
        }
        return '';
    };

    const validateNicNumber = (value) => {
        if (!value) return '';

        // Remove any existing 'v' or 'V' and check
        const cleanValue = value.toLowerCase().replace('v', '');

        if (cleanValue.length === 9) {
            if (!/^\d{9}$/.test(cleanValue)) {
                return 'Old NIC format should be 9 digits followed by V (e.g., 273017385V)';
            }
        } else if (cleanValue.length === 12) {
            if (!/^\d{12}$/.test(cleanValue)) {
                return 'New NIC format should be exactly 12 digits (e.g., 200527033289)';
            }
        } else {
            return 'NIC should be either 9 digits + V or 12 digits';
        }
        return '';
    };

    const validateDateOfBirth = (value) => {
        if (!value) return '';

        const selectedDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();

        if (selectedDate > today) {
            return 'Date of birth cannot be in the future';
        }

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
            if (age < 18) {
                return 'Employee must be at least 18 years old';
            }
        } else {
            if (age < 18) {
                return 'Employee must be at least 18 years old';
            }
        }

        if (age > 70) {
            return 'Employee cannot be older than 70 years';
        }

        return '';
    };

    const validateProfilePicture = (file) => {
        if (!file) return '';

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return 'Only image files (JPEG, PNG, GIF, WebP) are allowed';
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return 'Image size must be less than 5MB';
        }

        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        let error = '';

        // Apply specific validations and formatting
        switch (name) {
            case 'epfNumber':
                // Only allow digits and limit to 4
                processedValue = value.replace(/\D/g, '').slice(0, 4);
                error = validateEpfNumber(processedValue);
                break;
            case 'name':
                // Only allow letters and spaces
                processedValue = value.replace(/[^a-zA-Z\s]/g, '');
                error = validateName(processedValue);
                break;
            case 'nicNumber':
                // Handle NIC formatting
                let cleanNic = value.replace(/[^0-9vV]/g, '');
                if (cleanNic.length <= 9 && !cleanNic.toLowerCase().includes('v')) {
                    processedValue = cleanNic;
                } else if (cleanNic.length === 9 && !cleanNic.toLowerCase().includes('v')) {
                    processedValue = cleanNic + 'V';
                } else if (cleanNic.length === 10 && cleanNic.toLowerCase().endsWith('v')) {
                    processedValue = cleanNic;
                } else if (cleanNic.length <= 12 && !cleanNic.toLowerCase().includes('v')) {
                    processedValue = cleanNic;
                } else {
                    processedValue = cleanNic.slice(0, cleanNic.toLowerCase().includes('v') ? 10 : 12);
                }
                error = validateNicNumber(processedValue);
                break;
            case 'dateOfBirth':
                error = validateDateOfBirth(value);
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'spouseName':
                processedValue = value.replace(/[^a-zA-Z\s]/g, '');
                break;
            default:
                break;
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        // Update errors
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleContactNumberChange = (phone) => {
        // Limit the phone number to proper Sri Lankan format
        const digits = phone.replace(/\D/g, '');
        let limitedPhone = phone;

        if (digits.startsWith('94')) {
            // For country code format, limit to 94 + 9 digits = 11 total
            if (digits.length > 11) {
                const limitedDigits = digits.substring(0, 11);
                limitedPhone = phone.startsWith('+') ? '+' + limitedDigits : limitedDigits;
            }
        } else if (digits.startsWith('0')) {
            // For local format, limit to 10 digits
            if (digits.length > 10) {
                limitedPhone = digits.substring(0, 10);
            }
        }

        const error = validateSriLankanNumber(limitedPhone);
        setFormData(prev => ({
            ...prev,
            contactNumber: limitedPhone
        }));
        setErrors(prev => ({
            ...prev,
            contactNumber: error
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateProfilePicture(file);
            if (error) {
                setErrors(prev => ({ ...prev, profilePicture: error }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                profilePicture: file,
            }));
            setErrors(prev => ({ ...prev, profilePicture: '' }));
        }
    };

    const handleMaritalStatusChange = (e) => {
        const status = e.target.value;
        setFormData(prev => ({
            ...prev,
            maritalStatus: status,
            spouseName: status === 'Married' ? prev.spouseName : '',
            parents: status === 'Unmarried' ? (prev.parents.length === 0 ? [{ name: '', relationship: '', contactNumber: '' }] : prev.parents) : [],
            children: status === 'Married' ? prev.children : []
        }));

        // Clear related errors
        setErrors(prev => {
            const newErrors = { ...prev };
            if (status === 'Unmarried') {
                delete newErrors.spouseName;
            } else {
                delete newErrors.parents;
                prev.parents?.forEach((_, index) => {
                    delete newErrors[`parent_${index}_name`];
                    delete newErrors[`parent_${index}_relationship`];
                    delete newErrors[`parent_${index}_contactNumber`];
                });
            }
            return newErrors;
        });
    };

    const handleParentChange = (index, field, value) => {
        let processedValue = value;
        let error = '';

        if (field === 'name') {
            processedValue = value.replace(/[^a-zA-Z\s]/g, '');
            if (processedValue && processedValue.length < 2) {
                error = 'Name must be at least 2 characters';
            }
        } else if (field === 'contactNumber') {
            // Limit the phone number to proper Sri Lankan format for parents too
            const digits = value.replace(/\D/g, '');

            if (digits.startsWith('94')) {
                // For country code format, limit to 94 + 9 digits = 11 total
                if (digits.length > 11) {
                    const limitedDigits = digits.substring(0, 11);
                    processedValue = value.startsWith('+') ? '+' + limitedDigits : limitedDigits;
                } else {
                    processedValue = value;
                }
            } else if (digits.startsWith('0')) {
                // For local format, limit to 10 digits
                if (digits.length > 10) {
                    processedValue = digits.substring(0, 10);
                } else {
                    processedValue = value;
                }
            } else {
                processedValue = value;
            }

            error = validateSriLankanNumber(processedValue);
        }

        const updatedParents = [...formData.parents];
        updatedParents[index] = { ...updatedParents[index], [field]: processedValue };
        setFormData(prev => ({ ...prev, parents: updatedParents }));

        // Update error for this specific field
        setErrors(prev => ({
            ...prev,
            [`parent_${index}_${field}`]: error
        }));
    };

    const addParent = () => {
        setFormData(prev => ({
            ...prev,
            parents: [...prev.parents, { name: '', relationship: '', contactNumber: '' }]
        }));
    };

    const removeParent = (index) => {
        setFormData(prev => ({
            ...prev,
            parents: prev.parents.filter((_, i) => i !== index)
        }));

        // Clear errors for removed parent
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`parent_${index}_name`];
            delete newErrors[`parent_${index}_relationship`];
            delete newErrors[`parent_${index}_contactNumber`];
            return newErrors;
        });
    };

    const handleChildChange = (index, field, value) => {
        let processedValue = value;

        if (field === 'name') {
            processedValue = value.replace(/[^a-zA-Z\s]/g, '');
        }

        const updatedChildren = [...formData.children];
        updatedChildren[index] = { ...updatedChildren[index], [field]: processedValue };
        setFormData(prev => ({ ...prev, children: updatedChildren }));
    };

    const addChild = () => {
        setFormData(prev => ({
            ...prev,
            children: [...prev.children, { name: '', dateOfBirth: '', gender: '', school: '', grade: '' }]
        }));
    };

    const removeChild = (index) => {
        setFormData(prev => ({
            ...prev,
            children: prev.children.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields with real-time validation
        if (!formData.epfNumber.trim()) {
            newErrors.epfNumber = 'EPF Number is required';
        } else if (formData.epfNumber.length !== 4) {
            newErrors.epfNumber = 'EPF Number must be exactly 4 digits';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Employee name is required';
        } else {
            const nameError = validateName(formData.name);
            if (nameError) newErrors.name = nameError;
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = 'Contact number is required';
        } else {
            const phoneError = validateSriLankanNumber(formData.contactNumber);
            if (phoneError) newErrors.contactNumber = phoneError;
        }

        // Date of birth validation
        if (formData.dateOfBirth) {
            const dobError = validateDateOfBirth(formData.dateOfBirth);
            if (dobError) newErrors.dateOfBirth = dobError;
        }

        // NIC validation
        if (formData.nicNumber) {
            const nicError = validateNicNumber(formData.nicNumber);
            if (nicError) newErrors.nicNumber = nicError;
        }

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Marital status dependent validations
        if (formData.maritalStatus === 'Married') {
            if (!formData.spouseName.trim()) {
                newErrors.spouseName = 'Spouse name is required for married employees';
            }
        } else {
            if (formData.parents.length === 0) {
                newErrors.parents = 'At least one parent/guardian is required for unmarried employees';
            } else {
                // Validate each parent
                formData.parents.forEach((parent, index) => {
                    if (!parent.name.trim()) {
                        newErrors[`parent_${index}_name`] = 'Parent name is required';
                    }
                    if (!parent.relationship) {
                        newErrors[`parent_${index}_relationship`] = 'Relationship is required';
                    }
                    if (!parent.contactNumber.trim()) {
                        newErrors[`parent_${index}_contactNumber`] = 'Contact number is required';
                    } else {
                        const phoneError = validateSriLankanNumber(parent.contactNumber);
                        if (phoneError) {
                            newErrors[`parent_${index}_contactNumber`] = phoneError;
                        }
                    }
                });
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                basicSalary: formData.basicSalary ? parseFloat(formData.basicSalary) : undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
                joinedDate: formData.joinedDate || undefined,
                children: formData.children.map(child => ({
                    ...child,
                    dateOfBirth: child.dateOfBirth || undefined
                })),
            };

            console.log(submitData);


            // Call Axios API
            const response = await createEmployeeApi(submitData);

            showNotification('success', 'Employee created successfully!');
            handleReset();
        } catch (err) {
            console.error('Error creating employee:', err);
            const msg = err.message || 'Failed to create employee';
            showNotification('error', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            epfNumber: '',
            name: '',
            address: '',
            dateOfBirth: '',
            nicNumber: '',
            gender: '',
            email: '',
            department: '',
            joinedDate: '',
            basicSalary: '',
            employmentType: '',
            profilePicture: null,
            maritalStatus: 'Unmarried',
            spouseName: '',
            parents: [],
            children: [],
            contactNumber: ''
        });
        setErrors({});
        setNotification(null);
    };

    return (
        <div className="">
            <div className="w-full mx-auto px-4">
                {/* Notification */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg border flex items-center space-x-3 ${notification.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="flex-1">{notification.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <User className="w-5 h-5" />
                                <span>Basic Information</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* EPF Number */}
                                <div>
                                    <label htmlFor="epfNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        EPF Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="epfNumber"
                                        name="epfNumber"
                                        value={formData.epfNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.epfNumber
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="Enter 4-digit EPF number"
                                        disabled={loading}
                                        maxLength="4"
                                    />
                                    {errors.epfNumber && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.epfNumber}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.name
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="Enter full name (letters only)"
                                        disabled={loading}
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.name}</span>
                                        </p>
                                    )}
                                </div>

                                {/* NIC Number */}
                                <div>
                                    <label htmlFor="nicNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        NIC Number
                                    </label>
                                    <input
                                        type="text"
                                        id="nicNumber"
                                        name="nicNumber"
                                        value={formData.nicNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.nicNumber
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="Enter NIC (9 digits + V or 12 digits)"
                                        disabled={loading}
                                    />
                                    {errors.nicNumber && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.nicNumber}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Contact Number */}
                                <div>
                                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className={`relative rounded-lg border transition-colors duration-200 ${errors.contactNumber
                                        ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
                                        : 'border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500'
                                        } focus-within:ring-2`}>
                                        <style jsx>{`
                                            .react-tel-input {
                                                width: 100% !important;
                                            }
                                            .react-tel-input .form-control {
                                                width: 100% !important;
                                                height: 48px !important;
                                                padding: 12px 16px !important;
                                                padding-left: 58px !important;
                                                border: none !important;
                                                border-radius: 8px !important;
                                                font-size: 14px !important;
                                                background: transparent !important;
                                                outline: none !important;
                                                box-shadow: none !important;
                                            }
                                            .react-tel-input .form-control:focus {
                                                border: none !important;
                                                box-shadow: none !important;
                                                outline: none !important;
                                            }
                                            .react-tel-input .form-control:disabled {
                                                background-color: #f9fafb !important;
                                                cursor: not-allowed !important;
                                            }
                                            .react-tel-input .flag-dropdown {
                                                border: none !important;
                                                background: transparent !important;
                                                border-radius: 8px 0 0 8px !important;
                                            }
                                            .react-tel-input .flag-dropdown:hover {
                                                background-color: #f3f4f6 !important;
                                            }
                                            .react-tel-input .flag-dropdown.open {
                                                background-color: #f3f4f6 !important;
                                            }
                                            .react-tel-input .selected-flag {
                                                padding: 0 8px !important;
                                                height: 48px !important;
                                                border-radius: 8px 0 0 8px !important;
                                            }
                                            .react-tel-input .selected-flag:hover,
                                            .react-tel-input .selected-flag:focus {
                                                background-color: #f3f4f6 !important;
                                            }
                                            .react-tel-input .country-list {
                                                border-radius: 8px !important;
                                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                                                border: 1px solid #e5e7eb !important;
                                                max-height: 200px !important;
                                                overflow-y: auto !important;
                                            }
                                            .react-tel-input .country-list .country:hover {
                                                background-color: #f3f4f6 !important;
                                            }
                                            .react-tel-input .country-list .country.highlight {
                                                background-color: #dbeafe !important;
                                            }
                                        `}</style>
                                        <PhoneInput
                                            country={'lk'}
                                            value={formData.contactNumber}
                                            onChange={handleContactNumberChange}
                                            inputProps={{
                                                name: 'contactNumber',
                                                required: true,
                                                disabled: loading,
                                                placeholder: 'Enter Sri Lankan mobile number',
                                                maxLength: 15
                                            }}
                                            onlyCountries={['lk']}
                                            containerClass="w-full"
                                            inputClass="w-full"
                                            buttonClass="border-0"
                                            dropdownClass="text-sm"
                                            enableSearch={false}
                                        />
                                    </div>
                                    {errors.contactNumber && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.contactNumber}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.email
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="Enter email address"
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.email}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                        disabled={loading}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.dateOfBirth
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        disabled={loading}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.dateOfBirth && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.dateOfBirth}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Department */}
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.department
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        disabled={loading}
                                    >
                                        <option value="">Select department</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                                        ))}
                                    </select>
                                    {errors.department && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.department}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mt-6">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none resize-none"
                                    placeholder="Enter full address"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Employment Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Joined Date */}
                                <div>
                                    <label htmlFor="joinedDate" className="block text-sm font-medium text-gray-700 mb-2">
                                        Joined Date
                                    </label>
                                    <input
                                        type="date"
                                        id="joinedDate"
                                        name="joinedDate"
                                        value={formData.joinedDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                        disabled={loading}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                {/* Employment Type */}
                                <div>
                                    <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Employment Type
                                    </label>
                                    <select
                                        id="employmentType"
                                        name="employmentType"
                                        value={formData.employmentType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                        disabled={loading}
                                    >
                                        <option value="">Select type</option>
                                        <option value="Permanent">Permanent</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Intern">Intern</option>
                                    </select>
                                </div>

                                {/* Basic Salary */}
                                <div>
                                    <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700 mb-2">
                                        Basic Salary (LKR)
                                    </label>
                                    <input
                                        type="number"
                                        id="basicSalary"
                                        name="basicSalary"
                                        value={formData.basicSalary}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                        placeholder="Enter basic salary"
                                        min="0"
                                        step="0.01"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                            {/* Marital Status */}
                            <div className="mb-6">
                                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
                                    Marital Status
                                </label>
                                <select
                                    id="maritalStatus"
                                    name="maritalStatus"
                                    value={formData.maritalStatus}
                                    onChange={handleMaritalStatusChange}
                                    className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                    disabled={loading}
                                >
                                    <option value="Unmarried">Unmarried</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>

                            {/* Spouse Name (if married) */}
                            {formData.maritalStatus === 'Married' && (
                                <div className="mb-6">
                                    <label htmlFor="spouseName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Spouse Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="spouseName"
                                        name="spouseName"
                                        value={formData.spouseName}
                                        onChange={handleInputChange}
                                        className={`w-full md:w-1/2 px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.spouseName
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="Enter spouse name (letters only)"
                                        disabled={loading}
                                    />
                                    {errors.spouseName && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.spouseName}</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Parents/Guardians (if unmarried) */}
                            {formData.maritalStatus === 'Unmarried' && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Parents/Guardians <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addParent}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                            disabled={loading}
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Parent/Guardian</span>
                                        </button>
                                    </div>

                                    {formData.parents.map((parent, index) => (
                                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-medium text-gray-700">Parent/Guardian {index + 1}</h4>
                                                {formData.parents.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeParent(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Name (letters only)"
                                                        value={parent.name}
                                                        onChange={(e) => handleParentChange(index, 'name', e.target.value)}
                                                        className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors[`parent_${index}_name`]
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                            }`}
                                                        disabled={loading}
                                                    />
                                                    {errors[`parent_${index}_name`] && (
                                                        <p className="mt-1 text-xs text-red-600">{errors[`parent_${index}_name`]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <select
                                                        value={parent.relationship}
                                                        onChange={(e) => handleParentChange(index, 'relationship', e.target.value)}
                                                        className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors[`parent_${index}_relationship`]
                                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                            }`}
                                                        disabled={loading}
                                                    >
                                                        <option value="">Select relationship</option>
                                                        <option value="Father">Father</option>
                                                        <option value="Mother">Mother</option>
                                                        <option value="Guardian">Guardian</option>
                                                    </select>
                                                    {errors[`parent_${index}_relationship`] && (
                                                        <p className="mt-1 text-xs text-red-600">{errors[`parent_${index}_relationship`]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className={`relative rounded-lg border transition-colors duration-200 ${errors[`parent_${index}_contactNumber`]
                                                        ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
                                                        : 'border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500'
                                                        } focus-within:ring-2`}>
                                                        <PhoneInput
                                                            country={'lk'}
                                                            value={parent.contactNumber}
                                                            onChange={(phone) => handleParentChange(index, 'contactNumber', phone)}
                                                            inputProps={{
                                                                name: `parent_${index}_contactNumber`,
                                                                required: true,
                                                                disabled: loading,
                                                                placeholder: 'Contact number',
                                                                maxLength: 15
                                                            }}
                                                            onlyCountries={['lk']}
                                                            containerClass="w-full"
                                                            inputClass="w-full"
                                                            buttonClass="border-0"
                                                            dropdownClass="text-sm"
                                                            enableSearch={false}
                                                        />
                                                    </div>
                                                    {errors[`parent_${index}_contactNumber`] && (
                                                        <p className="mt-1 text-xs text-red-600">{errors[`parent_${index}_contactNumber`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {errors.parents && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.parents}</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Children (only for married) */}
                            {formData.maritalStatus === 'Married' && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Children (Optional)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addChild}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                                            disabled={loading}
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Child</span>
                                        </button>
                                    </div>

                                    {formData.children.map((child, index) => (
                                        <div key={index} className="mb-4 p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-medium text-gray-700">Child {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeChild(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Child's name (letters only)"
                                                        value={child.name}
                                                        onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                                        disabled={loading}
                                                    />
                                                </div>

                                                <div>
                                                    <input
                                                        type="date"
                                                        placeholder="Date of birth"
                                                        value={child.dateOfBirth}
                                                        onChange={(e) => handleChildChange(index, 'dateOfBirth', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                                        disabled={loading}
                                                        max={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>

                                                <div>
                                                    <select
                                                        value={child.gender}
                                                        onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                                        disabled={loading}
                                                    >
                                                        <option value="">Select gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="School"
                                                        value={child.school}
                                                        onChange={(e) => handleChildChange(index, 'school', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                                        disabled={loading}
                                                    />
                                                </div>

                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Grade"
                                                        value={child.grade}
                                                        onChange={(e) => handleChildChange(index, 'grade', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 focus:outline-none"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Profile Picture */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>

                            <div className="space-y-4">
                                {/* File Upload */}
                                <div>
                                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Profile Picture
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <label htmlFor="profilePicture" className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors duration-200">
                                            <Upload className="w-4 h-4 mr-2" />
                                            <span>Choose Image</span>
                                        </label>
                                        <input
                                            type="file"
                                            id="profilePicture"
                                            name="profilePicture"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                            disabled={loading}
                                        />
                                        {formData.profilePicture && (
                                            <div className="flex items-center space-x-2 text-sm text-green-600">
                                                <Image className="w-4 h-4" />
                                                <span>{formData.profilePicture.name}</span>
                                                <span className="text-gray-500">
                                                    ({(formData.profilePicture.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {errors.profilePicture && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.profilePicture}</span>
                                        </p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 ">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                                disabled={loading}
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                // Replace the current disabled condition with:
                                disabled={loading ||
                                    !formData.epfNumber.trim() ||
                                    !formData.name.trim() ||
                                    !formData.department ||
                                    !formData.contactNumber.trim() ||
                                    Object.values(errors).some(error => error !== '')}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Create Employee</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Text */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Real-time Validation Guidelines:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li><strong>EPF Number:</strong> Must be exactly 4 digits</li>
                                <li><strong>Name:</strong> Only letters and spaces allowed, minimum 2 characters</li>
                                <li><strong>Contact Number:</strong> Sri Lankan numbers only - 10 digits starting with 07 OR exactly 9 digits after country code 94 (947xxxxxxxx)</li>
                                <li><strong>NIC Number:</strong> 9 digits + V (e.g., 273017385V) or 12 digits (e.g., 200527033289)</li>
                                <li><strong>Date of Birth:</strong> Must be 18-70 years old, no future dates</li>
                                <li><strong>Marital Status:</strong> Unmarried employees need parent/guardian info, married employees can add spouse and children</li>
                                <li><strong>Profile Picture:</strong> Upload images up to 5MB or provide URL</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeForm;