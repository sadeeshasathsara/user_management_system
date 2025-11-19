import React, { useState, useEffect } from 'react';
import { User, Save, Search, AlertCircle, CheckCircle, X, ChevronDown, DollarSign, Users, Target, ExternalLink, TrendingUp, Briefcase, Calendar } from 'lucide-react';
import { getEmployeesApi } from '../apis/employee.api';
import { getMaxEpf, getEmpEpf, createOrUpdateEmployeeEpf } from '../apis/epf.api';
import { useNavigate } from 'react-router-dom';

const AddEpfForm = ({ onBack }) => {
    const currentYear = new Date().getFullYear();

    const [formData, setFormData] = useState({
        user: '',
        expense: '',
        year: currentYear.toString(),
        selectedRange: null // New field for selected EPF range
    });

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);
    const [currentEpfExpense, setCurrentEpfExpense] = useState(null);

    // New state for EPF ranges and employee EPF data
    const [epfRanges, setEpfRanges] = useState([]);
    const [maxEpf, setMaxEpf] = useState(0);
    const [rangesLoading, setRangesLoading] = useState(false);
    const [employeeEpfData, setEmployeeEpfData] = useState(null);
    const [employeeEpfLoading, setEmployeeEpfLoading] = useState(false);

    // Helper function to safely get department name
    const getDepartmentName = (department) => {
        if (!department) return null;
        if (typeof department === 'string') return department;
        if (typeof department === 'object' && department.name) return department.name;
        return null;
    };

    // Fetch EPF ranges on component mount
    useEffect(() => {
        fetchEpfRanges();
    }, []);

    const fetchEpfRanges = async () => {
        try {
            setRangesLoading(true);
            const response = await getMaxEpf();

            if (response.success && response.data) {
                setMaxEpf(response.data.maxEpf || 0);
                setEpfRanges(response.data.ranges || []);
            }
        } catch (error) {
            console.error('Error fetching EPF ranges:', error);
            showNotification('error', 'Failed to load EPF ranges');
        } finally {
            setRangesLoading(false);
        }
    };

    // Fetch employee EPF data when user is selected
    useEffect(() => {
        if (formData.user && formData.year) {
            fetchEmployeeEpfData(formData.user, formData.year);
        } else {
            setEmployeeEpfData(null);
        }
    }, [formData.user, formData.year]);

    const fetchEmployeeEpfData = async (userId, year) => {
        try {
            setEmployeeEpfLoading(true);
            const query = {
                user_id: userId,
                year: parseInt(year)
            };

            console.log('Fetching EPF data with query:', query); // Debug log

            const response = await getEmpEpf(query);
            console.log('Full EPF API Response:', response); // Debug log

            // Handle different possible response structures
            let employeeRecord = null;

            if (response) {
                // Case 1: Direct success with data array
                if (response.success && Array.isArray(response.data)) {
                    console.log('Case 1: Direct data array', response.data);
                    employeeRecord = response.data.find(record => record.user === userId || record.user?._id === userId) || response.data[0];
                }
                // Case 2: Nested success with data.data array
                else if (response.success && response.data && response.data.success && Array.isArray(response.data.data)) {
                    console.log('Case 2: Nested data array', response.data.data);
                    employeeRecord = response.data.data.find(record => record.user === userId || record.user?._id === userId) || response.data.data[0];
                }
                // Case 3: Direct array response
                else if (Array.isArray(response)) {
                    console.log('Case 3: Direct array response', response);
                    employeeRecord = response.find(record => record.user === userId || record.user?._id === userId) || response[0];
                }
                // Case 4: Single object response
                else if (response.success && response.data && !Array.isArray(response.data)) {
                    console.log('Case 4: Single object response', response.data);
                    employeeRecord = response.data;
                }
                // Case 5: Check if response itself is the data
                else if (response._id || response.user) {
                    console.log('Case 5: Response is the data object', response);
                    employeeRecord = response;
                }
            }

            console.log('Final employee record selected:', employeeRecord);
            setEmployeeEpfData(employeeRecord);

        } catch (error) {
            console.error('Error fetching employee EPF data:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setEmployeeEpfData(null);
        } finally {
            setEmployeeEpfLoading(false);
        }
    };

    // Real-time validation functions
    const validateExpense = (value) => {
        if (!value) return 'Medical expense is required';

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

        // Validate against selected range
        if (formData.selectedRange) {
            const selectedRangeData = epfRanges.find(range => range.name === formData.selectedRange);
            if (selectedRangeData && numValue > selectedRangeData.maxValue) {
                return `Expense cannot exceed ${selectedRangeData.name} limit of LKR ${selectedRangeData.maxValue.toLocaleString()}`;
            }
        }

        // Validate against max EPF
        if (maxEpf && numValue > maxEpf) {
            return `Expense cannot exceed maximum Medical limit of LKR ${maxEpf.toLocaleString()}`;
        }

        return '';
    };

    const validateUser = (value) => {
        if (!value) return 'Please select an employee';
        return '';
    };

    // Filter users based on search term
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            try {
                if (!searchTerm.trim()) {
                    setFilteredUsers([]);
                    setSearchLoading(false);
                    return;
                }

                setSearchLoading(true);

                // Only search by epfNumber and name
                const searchQuery = {
                    search: searchTerm.trim()
                };

                const response = await getEmployeesApi(searchQuery);

                console.log('API Response:', response); // Debug log

                // Handle different API response structures
                let users = [];
                if (Array.isArray(response)) {
                    users = response;
                } else if (response && Array.isArray(response.users)) {
                    users = response.users;
                } else if (response && Array.isArray(response.data)) {
                    users = response.data;
                } else {
                    console.warn('Unexpected API response structure:', response);
                    setFilteredUsers([]);
                    setSearchLoading(false);
                    return;
                }

                console.log('Extracted users array:', users); // Debug log

                // Filter to ensure we only have valid user objects with required fields
                const validUsers = users.filter(item => {
                    const isValidUser = item &&
                        typeof item === 'object' &&
                        item._id &&
                        item.name &&
                        item.epfNumber &&
                        typeof item.epfNumber === 'string' &&
                        typeof item.name === 'string';

                    if (!isValidUser) {
                        console.log('Filtered out invalid item:', item); // Debug log
                    }
                    return isValidUser;
                });

                console.log('Valid users after filtering:', validUsers); // Debug log

                // Additional client-side filtering for epfNumber and name only
                const filtered = validUsers.filter(user => {
                    try {
                        const searchLower = searchTerm.toLowerCase();
                        return (
                            (user.epfNumber && typeof user.epfNumber === 'string' && user.epfNumber.toLowerCase().includes(searchLower)) ||
                            (user.name && typeof user.name === 'string' && user.name.toLowerCase().includes(searchLower))
                        );
                    } catch (error) {
                        console.error('Error filtering user:', user, error);
                        return false;
                    }
                });

                console.log('Final filtered users:', filtered); // Debug log
                setFilteredUsers(filtered);
            } catch (err) {
                console.error('Error searching users:', err);
                setFilteredUsers([]);
            } finally {
                setSearchLoading(false);
            }
        }, 400); // 400ms debounce

        // Set loading state immediately when user starts typing
        if (searchTerm.trim()) {
            setSearchLoading(true);
        }

        return () => {
            clearTimeout(delayDebounce);
            setSearchLoading(false);
        };
    }, [searchTerm]);

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

        // Update errors - only set error if it exists, otherwise remove it
        setErrors(prev => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[name] = error;
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });
    };

    const handleRangeSelect = (rangeName) => {
        setFormData(prev => ({
            ...prev,
            selectedRange: prev.selectedRange === rangeName ? null : rangeName
        }));

        // Re-validate expense if it exists
        if (formData.expense) {
            const error = validateExpense(formData.expense);
            setErrors(prev => {
                const newErrors = { ...prev };
                if (error) {
                    newErrors.expense = error;
                } else {
                    delete newErrors.expense;
                }
                return newErrors;
            });
        }
    };

    useEffect(() => {
        console.log(`Select`);
        console.log(selectedUser);

    }, [selectedUser])

    const handleUserSelect = (user) => {
        console.log(`User`);
        console.log(user);

        setSelectedUser(user);


        setFormData(prev => ({
            ...prev,
            user: user._id
        }));
        setSearchTerm(`${user.epfNumber} - ${user.name}`);
        setIsDropdownOpen(false);

        // Clear user error
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.user;
            return newErrors;
        });
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

    // Helper function to check if form is valid for button state
    const isFormValid = () => {
        return formData.user &&
            formData.expense &&
            !validateUser(formData.user) &&
            !validateExpense(formData.expense);
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    // Popup modal for notifications (centered)
    const NotificationPopup = ({ notification, onClose }) => {
        if (!notification) return null;
        const isSuccess = notification.type === 'success';
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <div className={`relative max-w-md w-full p-6 rounded-lg shadow-2xl border ${isSuccess ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`} role="alert">
                    <div className="flex items-start space-x-3">
                        {isSuccess ? (
                            <CheckCircle className="w-6 h-6 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            <p className="font-medium">{notification.message}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const now = new Date().toISOString();
            const rangeExpenses = [];
            const regularExpenses = [];

            if (formData.expense) {
                const expenseEntry = {
                    amount: parseFloat(formData.expense),
                    expensedAt: now,
                    updatedAt: now,
                };

                if (formData.selectedRange) {
                    // Add to rangeExpenses
                    rangeExpenses.push({
                        name: formData.selectedRange,
                        expenses: [expenseEntry],
                    });
                } else {
                    // Add to regularExpenses
                    regularExpenses.push(expenseEntry);
                }
            }

            const payload = {
                user: formData.user,
                year: new Date(`${formData.year}-01-01`),
                rangeExpenses,
                regularExpenses,
            };

            console.log(payload);

            const response = await createOrUpdateEmployeeEpf(payload, "add");

            if (response.success) {
                showNotification('success', 'Medical record submitted successfully!');
                handleReset();
            } else {
                showNotification('error', response.message || 'Submission failed. Try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showNotification('error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const handleReset = () => {
        setFormData({
            user: '',
            expense: '',
            year: currentYear.toString(),
            selectedRange: null
        });
        setSelectedUser(null);
        setSearchTerm('');
        setEmployeeEpfData(null);
        setErrors({});
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

        // Check if profilePicture exists and is not null/undefined and doesn't end with '/null'
        const hasValidProfilePicture = user.profilePicture &&
            user.profilePicture !== 'null' &&
            !user.profilePicture.endsWith('/null') &&
            user.profilePicture.trim() !== '';

        if (hasValidProfilePicture) {
            return (
                <img
                    src={user.profilePicture}
                    alt={user.name}
                    className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`}
                    onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            );
        }

        return (
            <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0`}>
                <User className={`${iconSizes[size]} text-white`} />
            </div>
        );
    };

    const getIconComponent = (iconName) => {
        const icons = {
            Users,
            User,
            Target
        };
        const IconComponent = icons[iconName] || Users;
        return <IconComponent className="w-5 h-5" />;
    };

    const navigate = useNavigate();

    return (
        <div className="">
            <div className="w-full mx-auto px-4">
                {/* Notification popup */}
                {notification && (
                    <NotificationPopup notification={notification} onClose={() => setNotification(null)} />
                )}
                {/* Inline Notification (kept for compatibility) */}
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
                                <span>Add Medical Record</span>
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
                                            placeholder="Search by EPF number or name..."
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
                                            {searchLoading ? (
                                                // Skeleton Loading
                                                <div className="px-4 py-3 space-y-3">
                                                    {[...Array(3)].map((_, index) => (
                                                        <div key={index} className="flex items-center space-x-3 animate-pulse">
                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                                                            <div className="flex-1">
                                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : !Array.isArray(filteredUsers) || filteredUsers.length === 0 ? (
                                                <div className="px-4 py-3 text-sm text-gray-500">
                                                    {searchTerm.trim() ? 'No employees found' : 'Start typing to search employees'}
                                                </div>
                                            ) : (
                                                filteredUsers.map((user) => {
                                                    // Additional safety check to ensure it's a valid user object
                                                    if (!user ||
                                                        typeof user !== 'object' ||
                                                        !user._id ||
                                                        !user.epfNumber ||
                                                        !user.name ||
                                                        typeof user.epfNumber !== 'string' ||
                                                        typeof user.name !== 'string') {
                                                        console.error('Invalid user object in render:', user);
                                                        return null;
                                                    }

                                                    try {
                                                        const departmentName = getDepartmentName(user.department);

                                                        return (
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
                                                                                EPF: {String(user.epfNumber)} - {String(user.name)}
                                                                            </div>
                                                                            {departmentName && (
                                                                                <div className="text-sm text-gray-500">
                                                                                    Department: {departmentName}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {selectedUser?._id === user._id && (
                                                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    } catch (error) {
                                                        console.error('Error rendering user:', user, error);
                                                        return null;
                                                    }
                                                })
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
                                    <div className='w-full flex items-center justify-between mb-3'>
                                        <h5 className="font-medium text-blue-800 mb-3">Selected Employee</h5>
                                        <h5 onClick={() => { navigate(`epf?id=${employeeEpfData._id}`, '_blank') }} className="font-sm text-green-500 cursor-pointer hover:text-green-600 mb-3">All EPF Records</h5>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <ProfilePicture user={selectedUser} size="lg" />
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-blue-700">EPF Number:</span>
                                                    <span className="ml-2 text-blue-800">{selectedUser?.epfNumber}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Name:</span>
                                                    <span className="ml-2 text-blue-800">{selectedUser?.name}</span>
                                                </div>
                                                {getDepartmentName(selectedUser?.department) && (
                                                    <div>
                                                        <span className="font-medium text-blue-700">Department:</span>
                                                        <span className="ml-2 text-blue-800">{getDepartmentName(selectedUser?.department)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Employee EPF Data */}
                                            {employeeEpfLoading ? (
                                                <div className="mt-3 pt-3 border-t border-blue-200">
                                                    <div className="animate-pulse">
                                                        <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                                                        <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            ) : employeeEpfData ? (
                                                <div className="mt-3 pt-3 border-t border-blue-200">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-blue-700">Total EPF Expense ({formData.year}):</span>
                                                            <span className="text-lg font-bold text-blue-800">
                                                                LKR {employeeEpfData.expense?.toLocaleString() || '0'}
                                                            </span>
                                                        </div>

                                                        {employeeEpfData.rangeExpenses && employeeEpfData.rangeExpenses.length > 0 && (
                                                            <div className="mt-2">
                                                                <div className="text-sm font-medium text-blue-700 mb-1">Range Expenses:</div>
                                                                <div className="space-y-1">
                                                                    {employeeEpfData.rangeExpenses.map((range, index) => (
                                                                        <div key={index} className="text-sm text-blue-600">
                                                                            • {range.name}: LKR {range.expense?.toLocaleString() || '0'}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="text-sm font-medium text-blue-700 mb-1">Regular Expenses:</div>
                                                        <div className="text-sm text-blue-600">
                                                            • Regular: LKR {employeeEpfData.regularExpenses?.expense?.toLocaleString() || '0'}
                                                        </div>

                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-3 pt-3 border-t border-blue-200">
                                                    <div className="text-sm text-blue-600">
                                                        No EPF records found for {formData.year}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Medical Range Selection */}
                        <div className="border-b border-gray-200 pb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-4">Medical Range Selection (Optional)</h4>

                            {rangesLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(2)].map((_, index) => (
                                        <div key={index} className="animate-pulse">
                                            <div className="h-20 bg-gray-200 rounded-lg"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : epfRanges.length > 0 ? (
                                <>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Select a range to set expense limits, or leave unselected for no range restrictions (max: LKR {maxEpf.toLocaleString()})
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {epfRanges.map((range) => (
                                            <button
                                                key={range.name}
                                                type="button"
                                                onClick={() => handleRangeSelect(range.name)}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left transform hover:scale-105 ${formData.selectedRange === range.name
                                                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                                                    : 'border-gray-200 hover:border-indigo-300 bg-white hover:shadow-md'
                                                    }`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className={`p-3 rounded-xl ${formData.selectedRange === range.name
                                                        ? 'bg-indigo-100 text-indigo-600'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {getIconComponent(range.icon)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className={`font-semibold text-lg ${formData.selectedRange === range.name
                                                            ? 'text-indigo-800'
                                                            : 'text-gray-900'
                                                            }`}>
                                                            {range.name}
                                                        </div>
                                                        <div className={`text-sm mt-1 ${formData.selectedRange === range.name
                                                            ? 'text-indigo-600'
                                                            : 'text-gray-500'
                                                            }`}>
                                                            {range.description}
                                                        </div>
                                                        <div className={`text-sm font-bold mt-2 px-3 py-1 rounded-full inline-block ${formData.selectedRange === range.name
                                                            ? 'bg-indigo-100 text-indigo-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            Max: LKR {range.maxValue.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    {formData.selectedRange === range.name && (
                                                        <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No Medical ranges available</p>
                                </div>
                            )}
                        </div>

                        {/* EPF Details */}
                        <div className="border-b border-gray-200 pb-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                                <h4 className="text-md font-semibold text-gray-800">Medical Details</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* EPF Expense */}
                                <div>
                                    <label htmlFor="expense" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Medical Expense (LKR) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="expense"
                                            name="expense"
                                            value={formData.expense}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${errors.expense
                                                ? 'border-red-300 focus:ring-red-100 focus:border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:ring-emerald-100 focus:border-emerald-500 bg-white'
                                                }`}
                                            placeholder="Enter EPF expense amount"
                                            disabled={loading}
                                        />
                                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    {errors.expense && (
                                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-700 flex items-center space-x-2">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                <span>{errors.expense}</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Dynamic help text based on selected range */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-700">
                                            {formData.selectedRange ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                        <span className="font-medium">Selected range limit: LKR {epfRanges.find(r => r.name === formData.selectedRange)?.maxValue.toLocaleString() || '0'}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 ml-4">Maximum amount: LKR 1,000,000 (up to 2 decimal places)</div>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                        <span className="font-medium">No range selected - Maximum: LKR {maxEpf.toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 ml-4">Overall limit: LKR 1,000,000 (up to 2 decimal places)</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Year - Read only, set to current year */}
                                <div>
                                    <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Year
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="year"
                                            name="year"
                                            value={formData.year}
                                            className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 cursor-not-allowed"
                                            disabled={true}
                                            readOnly
                                        />
                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-700">
                                            Medical records are created for the current year ({currentYear})
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-8 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 border border-gray-300 hover:border-gray-400"
                                disabled={loading}
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading || !isFormValid()}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Create Medical Record</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        </div>
                        <div className="text-sm text-blue-800 flex-1">
                            <p className="font-semibold text-lg mb-3 text-blue-900">Medical Record Guidelines</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ul className="space-y-2 text-blue-700">
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <span><strong>Employee Selection:</strong> Search by EPF number or name only</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <span><strong>Range Selection:</strong> Optional - select a range to apply expense limits</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <span><strong>Medical Expense:</strong> Must be a positive number with maximum 2 decimal places</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <span><strong>Range Limits:</strong> When selected, expense cannot exceed the range's maximum value</span>
                                    </li>
                                </ul>
                                <ul className="space-y-2 text-blue-700">
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <span><strong>Overall Limits:</strong> Maximum Medical expense is LKR {maxEpf.toLocaleString()}, system limit is LKR 1,000,000</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <span><strong>Year:</strong> Automatically set to current year ({currentYear})</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <span><strong>Employee History:</strong> View existing Medical expenses and range breakdowns</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                                        <span>All fields marked with <span className="text-red-600 font-semibold">*</span> are required</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEpfForm;