
import React, { useState } from 'react';
import {
    User,
    Edit3,
    Trash2,
    X,
    Save,
    AlertTriangle,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Building2,
    CreditCard,
    Users,
    Heart,
    Baby,
    CheckCircle,
    DollarSign,
    Briefcase,
    UserCheck,
    Home,
    School,
    Plus
} from 'lucide-react';

const EmployeeWFullCard = ({ initialEmployee }) => {

    const [employee, setEmployee] = useState(initialEmployee);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [editingSections, setEditingSections] = useState({});
    const [editData, setEditData] = useState({});

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate age
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Show success message
    const showSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    // Handle edit section
    const startEditing = (section) => {
        setEditingSections({ ...editingSections, [section]: true });

        // Initialize edit data based on section
        switch (section) {
            case 'personal':
                setEditData({
                    ...editData,
                    personal: {
                        name: employee.name,
                        email: employee.email,
                        contactNumber: employee.contactNumber,
                        address: employee.address,
                        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
                        nicNumber: employee.nicNumber,
                        gender: employee.gender
                    }
                });
                break;
            case 'employment':
                setEditData({
                    ...editData,
                    employment: {
                        epfNumber: employee.epfNumber,
                        department: employee.department?.name || '',
                        joinedDate: employee.joinedDate ? employee.joinedDate.split('T')[0] : '',
                        basicSalary: employee.basicSalary,
                        employmentType: employee.employmentType
                    }
                });
                break;
            case 'family':
                setEditData({
                    ...editData,
                    family: {
                        maritalStatus: employee.maritalStatus,
                        spouseName: employee.spouseName || '',
                        children: employee.children ? [...employee.children] : [],
                        parents: employee.parents ? [...employee.parents] : []
                    }
                });
                break;
            case 'additional':
                setEditData({
                    ...editData,
                    additional: {
                        createdAt: employee.createdAt ? employee.createdAt.split('T')[0] : '',
                        updatedAt: employee.updatedAt ? employee.updatedAt.split('T')[0] : ''
                    }
                });
                break;
            default:
                break;
        }
    };

    // Handle save section
    const saveSection = async (section) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedEmployee = { ...employee };

            switch (section) {
                case 'personal':
                    Object.assign(updatedEmployee, editData.personal);
                    break;
                case 'employment':
                    Object.assign(updatedEmployee, editData.employment);
                    if (editData.employment.department) {
                        updatedEmployee.department = { name: editData.employment.department };
                    }
                    break;
                case 'family':
                    updatedEmployee.maritalStatus = editData.family.maritalStatus;
                    updatedEmployee.spouseName = editData.family.spouseName;
                    updatedEmployee.children = editData.family.children;
                    updatedEmployee.parents = editData.family.parents;
                    break;
                case 'additional':
                    updatedEmployee.createdAt = editData.additional.createdAt;
                    updatedEmployee.updatedAt = editData.additional.updatedAt;
                    break;
                default:
                    break;
            }

            updatedEmployee.updatedAt = new Date().toISOString();
            setEmployee(updatedEmployee);
            setEditingSections({ ...editingSections, [section]: false });
            showSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully!`);
        } catch (error) {
            console.error('Error updating employee:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add/remove child
    const addChild = () => {
        const newChild = {
            name: '',
            dateOfBirth: '',
            gender: '',
            school: '',
            grade: ''
        };
        setEditData({
            ...editData,
            family: {
                ...editData.family,
                children: [...(editData.family?.children || []), newChild]
            }
        });
    };

    const removeChild = (index) => {
        const updatedChildren = editData.family?.children?.filter((_, i) => i !== index) || [];
        setEditData({
            ...editData,
            family: {
                ...editData.family,
                children: updatedChildren
            }
        });
    };

    const updateChild = (index, field, value) => {
        const updatedChildren = [...(editData.family?.children || [])];
        updatedChildren[index] = { ...updatedChildren[index], [field]: value };
        setEditData({
            ...editData,
            family: {
                ...editData.family,
                children: updatedChildren
            }
        });
    };

    // Add/remove parent
    const addParent = () => {
        const newParent = {
            name: '',
            relationship: '',
            contactNumber: ''
        };
        setEditData({
            ...editData,
            family: {
                ...editData.family,
                parents: [...(editData.family?.parents || []), newParent]
            }
        });
    };

    const removeParent = (index) => {
        const updatedParents = editData.family?.parents?.filter((_, i) => i !== index) || [];
        setEditData({
            ...editData,
            family: {
                ...editData.family,
                parents: updatedParents
            }
        });
    };

    const updateParent = (index, field, value) => {
        const updatedParents = [...(editData.family?.parents || [])];
        updatedParents[index] = { ...updatedParents[index], [field]: value };
        setEditData({
            ...editData,
            family: {
                ...editData.family,
                parents: updatedParents
            }
        });
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsDeleted(true);
            setShowDeleteModal(false);
            showSuccess('Employee deleted successfully!');
        } catch (error) {
            console.error('Error deleting employee:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Modal backdrop component
    const ModalBackdrop = ({ children, show, onClose }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                <div
                    className="absolute inset-0 bg-black/50 transition-opacity duration-300"
                    onClick={onClose}
                />
                <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                    {children}
                </div>
            </div>
        );
    };

    // Success notification
    const SuccessNotification = () => {
        if (!showSuccessMessage) return null;

        return (
            <div className="fixed top-4 right-4 z-60 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{successMessage}</span>
            </div>
        );
    };

    // If deleted, show deleted state
    if (isDeleted) {
        return (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Employee Deleted</h3>
                <p className="text-red-700">The employee has been successfully removed from the system.</p>
            </div>
        );
    }

    return (
        <>
            <SuccessNotification />

            {/* Main Employee Card */}
            <div
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group cursor-pointer"
                onClick={() => setShowDetailModal(true)}
            >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                {employee.profilePicture ? (
                                    <img
                                        src={employee.profilePicture}
                                        alt={employee.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                    {employee.name}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <CreditCard className="w-4 h-4" />
                                        <span>EPF: {employee.epfNumber}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Building2 className="w-4 h-4" />
                                        <span>{employee.department?.name || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold text-green-600">
                                Rs. {employee.basicSalary?.toLocaleString() || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">{employee.employmentType}</div>
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{employee.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{employee.contactNumber}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Joined {formatDate(employee.joinedDate)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Heart className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{employee.maritalStatus}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <ModalBackdrop show={showDetailModal} onClose={() => setShowDetailModal(false)}>
                <div className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                {employee.profilePicture ? (
                                    <img
                                        src={employee.profilePicture}
                                        alt={employee.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                                <p className="text-gray-500">EPF: {employee.epfNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                                title="Delete Employee"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <UserCheck className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                </div>
                                {!editingSections.personal ? (
                                    <button
                                        onClick={() => startEditing('personal')}
                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingSections({ ...editingSections, personal: false })}
                                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => saveSection('personal')}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!editingSections.personal ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Full Name</span>
                                        <p className="text-gray-900">{employee.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Email</span>
                                        <p className="text-gray-900">{employee.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Phone</span>
                                        <p className="text-gray-900">{employee.contactNumber}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">NIC Number</span>
                                        <p className="text-gray-900">{employee.nicNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                                        <p className="text-gray-900">{formatDate(employee.dateOfBirth)} ({calculateAge(employee.dateOfBirth)} years)</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Gender</span>
                                        <p className="text-gray-900">{employee.gender || 'N/A'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="text-sm font-medium text-gray-500">Address</span>
                                        <p className="text-gray-900">{employee.address || 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={editData.personal?.name || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            personal: { ...editData.personal, name: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={editData.personal?.email || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            personal: { ...editData.personal, email: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={editData.personal?.contactNumber || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            personal: { ...editData.personal, contactNumber: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="NIC Number"
                                        value={editData.personal?.nicNumber || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            personal: { ...editData.personal, nicNumber: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={editData.personal?.dateOfBirth || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            personal: { ...editData.personal, dateOfBirth: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <select
                                        value={editData.personal?.gender || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            personal: { ...editData.personal, gender: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <textarea
                                        placeholder="Address"
                                        value={editData.personal?.address || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            personal: { ...editData.personal, address: e.target.value }
                                        })}
                                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        rows={2}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Employment Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
                                </div>
                                {!editingSections.employment ? (
                                    <button
                                        onClick={() => startEditing('employment')}
                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingSections({ ...editingSections, employment: false })}
                                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => saveSection('employment')}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!editingSections.employment ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">EPF Number</span>
                                        <p className="text-gray-900">{employee.epfNumber}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Department</span>
                                        <p className="text-gray-900">{employee.department?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Join Date</span>
                                        <p className="text-gray-900">{formatDate(employee.joinedDate)}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Employment Type</span>
                                        <p className="text-gray-900">{employee.employmentType || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Basic Salary</span>
                                        <p className="text-gray-900 text-lg font-semibold text-green-600">
                                            Rs. {employee.basicSalary?.toLocaleString() || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="EPF Number"
                                        value={editData.employment?.epfNumber || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            employment: { ...editData.employment, epfNumber: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Department"
                                        value={editData.employment?.department || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            employment: { ...editData.employment, department: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={editData.employment?.joinedDate || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            employment: { ...editData.employment, joinedDate: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <select
                                        value={editData.employment?.employmentType || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            employment: { ...editData.employment, employmentType: e.target.value }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Permanent">Permanent</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Intern">Intern</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Basic Salary"
                                        value={editData.employment?.basicSalary || ''}
                                        onChange={(e) => setEditData({
                                            ...editData,
                                            employment: { ...editData.employment, basicSalary: Number(e.target.value) }
                                        })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Family Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Heart className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
                                </div>
                                {!editingSections.family ? (
                                    <button
                                        onClick={() => startEditing('family')}
                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingSections({ ...editingSections, family: false })}
                                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => saveSection('family')}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!editingSections.family ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Marital Status</span>
                                            <p className="text-gray-900">{employee.maritalStatus}</p>
                                        </div>
                                        {employee.maritalStatus === 'Married' && employee.spouseName && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Spouse Name</span>
                                                <p className="text-gray-900">{employee.spouseName}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Children */}
                                    {employee.children && employee.children.length > 0 && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 mb-2 block">Children</span>
                                            <div className="space-y-2">
                                                {employee.children.map((child, index) => (
                                                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                                            <div>
                                                                <span className="font-medium text-gray-600">Name:</span>
                                                                <span className="ml-1">{child.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-gray-600">Age:</span>
                                                                <span className="ml-1">{calculateAge(child.dateOfBirth)} years</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-gray-600">Gender:</span>
                                                                <span className="ml-1">{child.gender}</span>
                                                            </div>
                                                            {child.school && (
                                                                <div>
                                                                    <span className="font-medium text-gray-600">School:</span>
                                                                    <span className="ml-1">{child.school}</span>
                                                                </div>
                                                            )}
                                                            {child.grade && (
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Grade:</span>
                                                                    <span className="ml-1">{child.grade}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Parents */}
                                    {employee.parents && employee.parents.length > 0 && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 mb-2 block">Parents/Guardians</span>
                                            <div className="space-y-2">
                                                {employee.parents.map((parent, index) => (
                                                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                                            <div>
                                                                <span className="font-medium text-gray-600">Name:</span>
                                                                <span className="ml-1">{parent.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-gray-600">Relationship:</span>
                                                                <span className="ml-1">{parent.relationship}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-gray-600">Contact:</span>
                                                                <span className="ml-1">{parent.contactNumber}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Basic Family Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <select
                                            value={editData.family?.maritalStatus || ''}
                                            onChange={(e) => setEditData({
                                                ...editData,
                                                family: { ...editData.family, maritalStatus: e.target.value }
                                            })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Marital Status</option>
                                            <option value="Unmarried">Unmarried</option>
                                            <option value="Married">Married</option>
                                        </select>
                                        {editData.family?.maritalStatus === 'Married' && (
                                            <input
                                                type="text"
                                                placeholder="Spouse Name"
                                                value={editData.family?.spouseName || ''}
                                                onChange={(e) => setEditData({
                                                    ...editData,
                                                    family: { ...editData.family, spouseName: e.target.value }
                                                })}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        )}
                                    </div>

                                    {/* Children Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-md font-semibold text-gray-700 flex items-center">
                                                <Baby className="w-4 h-4 mr-2" />
                                                Children
                                            </h4>
                                            <button
                                                onClick={addChild}
                                                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add Child</span>
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {editData.family?.children?.map((child, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 className="text-sm font-medium text-gray-600">Child {index + 1}</h5>
                                                        <button
                                                            onClick={() => removeChild(index)}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Child Name"
                                                            value={child.name || ''}
                                                            onChange={(e) => updateChild(index, 'name', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        />
                                                        <input
                                                            type="date"
                                                            placeholder="Date of Birth"
                                                            value={child.dateOfBirth ? child.dateOfBirth.split('T')[0] : ''}
                                                            onChange={(e) => updateChild(index, 'dateOfBirth', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        />
                                                        <select
                                                            value={child.gender || ''}
                                                            onChange={(e) => updateChild(index, 'gender', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                        </select>
                                                        <input
                                                            type="text"
                                                            placeholder="School (Optional)"
                                                            value={child.school || ''}
                                                            onChange={(e) => updateChild(index, 'school', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Grade (Optional)"
                                                            value={child.grade || ''}
                                                            onChange={(e) => updateChild(index, 'grade', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Parents Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-md font-semibold text-gray-700 flex items-center">
                                                <Users className="w-4 h-4 mr-2" />
                                                Parents/Guardians
                                            </h4>
                                            <button
                                                onClick={addParent}
                                                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add Parent</span>
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {editData.family?.parents?.map((parent, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 className="text-sm font-medium text-gray-600">Parent/Guardian {index + 1}</h5>
                                                        <button
                                                            onClick={() => removeParent(index)}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Parent Name"
                                                            value={parent.name || ''}
                                                            onChange={(e) => updateParent(index, 'name', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        />
                                                        <select
                                                            value={parent.relationship || ''}
                                                            onChange={(e) => updateParent(index, 'relationship', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        >
                                                            <option value="">Select Relationship</option>
                                                            <option value="Father">Father</option>
                                                            <option value="Mother">Mother</option>
                                                            <option value="Guardian">Guardian</option>
                                                        </select>
                                                        <input
                                                            type="tel"
                                                            placeholder="Contact Number"
                                                            value={parent.contactNumber || ''}
                                                            onChange={(e) => updateParent(index, 'contactNumber', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                                </div>
                                {!editingSections.additional ? (
                                    <button
                                        onClick={() => startEditing('additional')}
                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingSections({ ...editingSections, additional: false })}
                                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => saveSection('additional')}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!editingSections.additional ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-500">Created</span>
                                        <p className="text-gray-900">{formatDate(employee.createdAt)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Last Updated</span>
                                        <p className="text-gray-900">{formatDate(employee.updatedAt)}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="date"
                                        value={editData.additional?.createdAt || ''}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                additional: { ...editData.additional, createdAt: e.target.value }
                                            })
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={editData.additional?.updatedAt || ''}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                additional: { ...editData.additional, updatedAt: e.target.value }
                                            })
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </div>


                    </div>
                </div>
            </ModalBackdrop>

            {/* Delete Confirmation Modal */}
            <ModalBackdrop show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Delete Employee</h2>
                            <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">
                            Are you sure you want to delete <strong>"{employee.name}"</strong> (EPF: {employee.epfNumber})?
                            This will permanently remove the employee and all associated data.
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>{isLoading ? 'Deleting...' : 'Delete Employee'}</span>
                        </button>
                    </div>
                </div>
            </ModalBackdrop>
        </>
    );
};

export default EmployeeWFullCard;