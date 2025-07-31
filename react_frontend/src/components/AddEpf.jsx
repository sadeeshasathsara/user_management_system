import React, { useState, useEffect } from 'react';
import { User, Save, Search, AlertCircle, CheckCircle, X, ChevronDown, DollarSign } from 'lucide-react';

const AddEpfForm = ({ onBack }) => {
    const currentYear = new Date().getFullYear();

    const [formData, setFormData] = useState({
        user: '',
        expense: '',
        year: currentYear.toString()
    });

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);
    const [currentEpfExpense, setCurrentEpfExpense] = useState(null);

    // Mock users data - replace with actual API call
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Replace with actual API endpoint
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                // Mock data for demonstration
                const mockUsers = [
                    { _id: '1', epfNumber: '1001', name: 'John Doe', department: 'IT', profilePicture: null },
                    { _id: '2', epfNumber: '1002', name: 'Jane Smith', department: 'HR', profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
                    { _id: '3', epfNumber: '1003', name: 'Mike Johnson', department: 'Finance', profilePicture: null },
                    { _id: '4', epfNumber: '1004', name: 'Sarah Wilson', department: 'Marketing', profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
                    { _id: '5', epfNumber: '1005', name: 'David Brown', department: 'Operations', profilePicture: null },
                    { _id: '6', epfNumber: '1006', name: 'Lisa Davis', department: 'IT', profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
                    { _id: '7', epfNumber: '1007', name: 'Tom Anderson', department: 'Finance', profilePicture: null },
                    { _id: '8', epfNumber: '1008', name: 'Emma Taylor', department: 'HR', profilePicture: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face' }
                ];
                setUsers(mockUsers);
                setFilteredUsers(mockUsers);
            }
        };
        fetchUsers();
    }, []);

    // Real-time validation functions
    const validateExpense = (value) => {
        if (!value) return 'EPF expense is required';

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return 'Expense must be a valid number';
        }
        if (numValue <= 0) {
            return 'Expense must be greater than 0';
        }
        if (numValue > 1000000) {
            return 'Expense cannot exceed 1,000,000';
        }
        // Check for more than 2 decimal places
        if (value.includes('.') && value.split('.')[1]?.length > 2) {
            return 'Expense can have maximum 2 decimal places';
        }
        return '';
    };

    const validateUser = (value) => {
        if (!value) return 'Please select an employee';
        return '';
    };

    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.epfNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    // Fetch current EPF expense when user is selected
    useEffect(() => {
        if (formData.user && formData.year) {
            fetchCurrentEpfExpense(formData.user, formData.year);
        } else {
            setCurrentEpfExpense(null);
        }
    }, [formData.user, formData.year]);

    const fetchCurrentEpfExpense = async (userId, year) => {
        try {
            // Replace with actual API endpoint
            const response = await fetch(`/api/epf/${userId}/${year}`);
            if (response.ok) {
                const data = await response.json();
                setCurrentEpfExpense(data.expense || 0);
            } else {
                setCurrentEpfExpense(0);
            }
        } catch (error) {
            // Mock current expense for demonstration
            const mockExpense = Math.floor(Math.random() * 50000) + 10000;
            setCurrentEpfExpense(mockExpense);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        let error = '';

        // Apply specific validations
        switch (name) {
            case 'expense':
                // Allow only numbers and decimal point
                processedValue = value.replace(/[^0-9.]/g, '');
                // Prevent multiple decimal points
                const decimalCount = (processedValue.match(/\./g) || []).length;
                if (decimalCount > 1) {
                    processedValue = processedValue.slice(0, -1);
                }
                error = validateExpense(processedValue);
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

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setFormData(prev => ({
            ...prev,
            user: user._id
        }));
        setSearchTerm(`${user.epfNumber} - ${user.name}`);
        setIsDropdownOpen(false);

        // Clear user error
        setErrors(prev => ({
            ...prev,
            user: ''
        }));
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsDropdownOpen(true);

        // Clear selected user if search term doesn't match
        if (selectedUser && !value.includes(selectedUser.epfNumber)) {
            setSelectedUser(null);
            setFormData(prev => ({
                ...prev,
                user: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate user selection
        const userError = validateUser(formData.user);
        if (userError) newErrors.user = userError;

        // Validate expense
        const expenseError = validateExpense(formData.expense);
        if (expenseError) newErrors.expense = expenseError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                user: formData.user,
                expense: parseFloat(formData.expense),
                year: new Date(`${formData.year}-01-01`)
            };

            console.log('Submitting EPF data:', submitData);

            // Replace with your actual API endpoint
            const response = await fetch('/api/epf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('success', 'EPF record created successfully!');
                handleReset();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else if (data.message) {
                    showNotification('error', data.message);
                } else {
                    showNotification('error', 'Failed to create EPF record');
                }
            }
        } catch (error) {
            console.error('Error creating EPF record:', error);
            showNotification('error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            user: '',
            expense: '',
            year: currentYear.toString()
        });
        setSelectedUser(null);
        setSearchTerm('');
        setCurrentEpfExpense(null);
        setErrors({});
        setNotification(null);
        setIsDropdownOpen(false);
    };

    const ProfilePicture = ({ user, size = 'sm' }) => {
        const sizeClasses = {
            sm: 'w-8 h-8',
            md: 'w-10 h-10',
            lg: 'w-12 h-12'
        };

        const iconSizes = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6'
        };

        if (user.profilePicture) {
            return (
                <img
                    src={user.profilePicture}
                    alt={user.name}
                    className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`}
                />
            );
        }

        return (
            <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0`}>
                <User className={`${iconSizes[size]} text-white`} />
            </div>
        );
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
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                                <span>Add EPF Record</span>
                            </h3>
                        </div>

                        {/* Employee Selection */}
                        <div className="border-b border-gray-200 pb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-4">Employee Selection</h4>

                            <div className="relative">
                                <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Employee <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <div className={`relative rounded-lg border transition-colors duration-200 ${errors.user
                                        ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
                                        : 'border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500'
                                        } focus-within:ring-2`}>
                                        <input
                                            type="text"
                                            id="userSearch"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border-0 focus:outline-none focus:ring-0"
                                            placeholder="Search by EPF number, name, or department..."
                                            disabled={loading}
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        >
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>

                                    {/* Dropdown */}
                                    {isDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {filteredUsers.length === 0 ? (
                                                <div className="px-4 py-3 text-sm text-gray-500">
                                                    No employees found
                                                </div>
                                            ) : (
                                                filteredUsers.map((user) => (
                                                    <button
                                                        key={user._id}
                                                        type="button"
                                                        onClick={() => handleUserSelect(user)}
                                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-200 ${selectedUser?._id === user._id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <ProfilePicture user={user} size="sm" />
                                                                <div>
                                                                    <div className="font-medium">
                                                                        EPF: {user.epfNumber} - {user.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        Department: {user.department}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {selectedUser?._id === user._id && (
                                                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                                            )}
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {errors.user && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.user}</span>
                                    </p>
                                )}
                            </div>

                            {/* Selected Employee Info */}
                            {selectedUser && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h5 className="font-medium text-blue-800 mb-3">Selected Employee</h5>
                                    <div className="flex items-start space-x-4">
                                        <ProfilePicture user={selectedUser} size="lg" />
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-blue-700">EPF Number:</span>
                                                    <span className="ml-2 text-blue-800">{selectedUser.epfNumber}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Name:</span>
                                                    <span className="ml-2 text-blue-800">{selectedUser.name}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Department:</span>
                                                    <span className="ml-2 text-blue-800">{selectedUser.department}</span>
                                                </div>
                                            </div>

                                            {/* Current EPF Expense */}
                                            {currentEpfExpense !== null && (
                                                <div className="mt-3 pt-3 border-t border-blue-200">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-blue-700">Current EPF Expense ({formData.year}):</span>
                                                        <span className="text-lg font-bold text-blue-800">
                                                            LKR {currentEpfExpense.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* EPF Details */}
                        <div className="border-b border-gray-200 pb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-4">EPF Details</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* EPF Expense */}
                                <div>
                                    <label htmlFor="expense" className="block text-sm font-medium text-gray-700 mb-2">
                                        EPF Expense (LKR) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="expense"
                                        name="expense"
                                        value={formData.expense}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.expense
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        placeholder="Enter EPF expense amount"
                                        disabled={loading}
                                    />
                                    {errors.expense && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.expense}</span>
                                        </p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        Maximum amount: LKR 1,000,000 (up to 2 decimal places)
                                    </p>
                                </div>

                                {/* Year - Read only, set to current year */}
                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                        Year
                                    </label>
                                    <input
                                        type="text"
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                                        disabled={true}
                                        readOnly
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        EPF records are created for the current year ({currentYear})
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
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
                                disabled={loading || !formData.user || !formData.expense || Object.keys(errors).length > 0}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Create EPF Record</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">EPF Record Guidelines:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li><strong>Employee Selection:</strong> Search by EPF number, name, or department</li>
                                <li><strong>EPF Expense:</strong> Must be a positive number up to LKR 1,000,000 with maximum 2 decimal places</li>
                                <li><strong>Year:</strong> Automatically set to current year ({currentYear})</li>
                                <li><strong>Current Expense:</strong> Shows existing EPF expense for selected employee and year</li>
                                <li>All fields marked with <span className="text-red-500">*</span> are required</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEpfForm;