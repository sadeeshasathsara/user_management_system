import React, { useState } from 'react';
import {
    Wallet,
    Edit3,
    Trash2,
    X,
    Save,
    AlertTriangle,
    Calendar,
    User,
    Building2,
    DollarSign,
    CheckCircle,
    TrendingUp,
    Briefcase,
    Search,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const EpfWFullCard = ({ epfRecords: initialEpfRecords }) => {
    // Mock EPF records if none provided
    const defaultEpfRecords = [
        {
            _id: '1',
            user: {
                _id: 'user1',
                epfNumber: 'EPF001234',
                name: 'John Doe',
                email: 'john.doe@company.com',
                department: { name: 'Human Resources' },
                employmentType: 'Permanent',
                basicSalary: 75000
            },
            expense: 18500,
            year: new Date('2024-01-01'),
            maxEpf: 25000,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-07-20T14:45:00Z'
        },
        {
            _id: '2',
            user: {
                _id: 'user2',
                epfNumber: 'EPF005678',
                name: 'Jane Smith',
                email: 'jane.smith@company.com',
                department: { name: 'Finance' },
                employmentType: 'Permanent',
                basicSalary: 85000
            },
            expense: 22000,
            year: new Date('2024-01-01'),
            maxEpf: 25000,
            createdAt: '2024-02-10T09:15:00Z',
            updatedAt: '2024-07-25T16:30:00Z'
        },
        {
            _id: '3',
            user: {
                _id: 'user3',
                epfNumber: 'EPF009876',
                name: 'Mike Johnson',
                email: 'mike.johnson@company.com',
                department: { name: 'IT' },
                employmentType: 'Contract',
                basicSalary: 65000
            },
            expense: 15750,
            year: new Date('2023-01-01'),
            maxEpf: 25000,
            createdAt: '2023-03-05T11:20:00Z',
            updatedAt: '2024-06-15T10:45:00Z'
        }
    ];

    const [epfRecords, setEpfRecords] = useState(initialEpfRecords || defaultEpfRecords);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editData, setEditData] = useState({
        expense: 0,
        year: new Date().getFullYear()
    });
    const [isLoading, setIsLoading] = useState(false);

    // Filter EPF records based on search term
    const filteredEpfRecords = epfRecords.filter(record =>
        record.user.epfNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(record.year).getFullYear().toString().includes(searchTerm)
    );

    // Calculate EPF usage percentage
    const calculateUsagePercentage = (expense, maxEpf) => {
        return Math.min((expense / maxEpf) * 100, 100);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Show success message
    const showSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    // Handle card expand/collapse
    const toggleCard = (recordId) => {
        setExpandedCard(expandedCard === recordId ? null : recordId);
    };

    // Handle edit form submission
    const handleEditSubmit = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const updatedRecords = epfRecords.map(record =>
                record._id === selectedRecord._id
                    ? {
                        ...record,
                        expense: parseFloat(editData.expense),
                        year: new Date(`${editData.year}-01-01`),
                        updatedAt: new Date().toISOString()
                    }
                    : record
            );

            setEpfRecords(updatedRecords);
            setShowEditModal(false);
            setSelectedRecord(null);
            showSuccess('EPF record updated successfully!');
        } catch (error) {
            console.error('Error updating EPF record:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const updatedRecords = epfRecords.filter(record => record._id !== selectedRecord._id);
            setEpfRecords(updatedRecords);
            setShowDeleteModal(false);
            setSelectedRecord(null);
            setExpandedCard(null);
            showSuccess('EPF record deleted successfully!');
        } catch (error) {
            console.error('Error deleting EPF record:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = (record) => {
        setSelectedRecord(record);
        setEditData({
            expense: record.expense,
            year: new Date(record.year).getFullYear()
        });
        setShowEditModal(true);
    };

    // Open delete modal
    const openDeleteModal = (record) => {
        setSelectedRecord(record);
        setShowDeleteModal(true);
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
                <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
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

    return (
        <>
            <SuccessNotification />

            <div className="space-y-4">
                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by EPF number, employee name, department, or year..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                        />
                    </div>
                    {searchTerm && (
                        <p className="text-sm text-gray-600 mt-2">
                            Found {filteredEpfRecords.length} record{filteredEpfRecords.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* EPF Records */}
                {filteredEpfRecords.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No EPF records found matching your search.</p>
                    </div>
                ) : (
                    filteredEpfRecords.map((record) => {
                        const usagePercentage = calculateUsagePercentage(record.expense, record.maxEpf);
                        const isExpanded = expandedCard === record._id;
                        const remainingAmount = Math.max(record.maxEpf - record.expense, 0);

                        return (
                            <div
                                key={record._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                            >
                                {/* Clickable Header */}
                                <div
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 cursor-pointer hover:from-blue-100 hover:to-indigo-100 hover:shadow-md transition-all duration-200 group"
                                    onClick={() => toggleCard(record._id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                                <Wallet className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex items-center justify-between flex-1">
                                                <div className="w-32 min-w-32">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">EPF Number</p>
                                                    <p className="font-semibold text-gray-900 truncate">{record.user.epfNumber}</p>
                                                </div>
                                                <div className="w-20 min-w-20 text-center">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Year</p>
                                                    <p className="font-semibold text-gray-900">{new Date(record.year).getFullYear()}</p>
                                                </div>
                                                <div className="w-48 min-w-48">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Employee</p>
                                                    <p className="font-semibold text-gray-900 truncate">{record.user.name}</p>
                                                </div>
                                                <div className="w-24 min-w-24 text-center">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">EPF Usage</p>
                                                    <p className={`font-semibold ${usagePercentage >= 90 ? 'text-red-600' :
                                                            usagePercentage >= 75 ? 'text-yellow-600' :
                                                                'text-green-600'
                                                        }`}>
                                                        {usagePercentage.toFixed(0)}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            {isExpanded && (
                                                <div className="flex items-center space-x-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditModal(record);
                                                        }}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-lg transition-all duration-200 transform hover:scale-105"
                                                        title="Edit EPF Record"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteModal(record);
                                                        }}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                                                        title="Delete EPF Record"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="group-hover:text-blue-600 transition-colors duration-200">
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Content */}
                                {isExpanded && (
                                    <div className="bg-gradient-to-br from-blue-25 via-slate-50 to-indigo-25 px-6 py-6 animate-in slide-in-from-top duration-300 border-t border-blue-100/50">
                                        <div className="space-y-6">
                                            {/* Employee Information */}
                                            <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100/30 shadow-sm hover:shadow-md transition-all duration-200">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-blue-800 mb-2">Employee Details</p>
                                                    <div className="space-y-2">
                                                        <p className="text-gray-900 font-medium text-base">{record.user.name}</p>
                                                        <p className="text-sm text-gray-600">{record.user.email}</p>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <div className="flex items-center space-x-1">
                                                                <Building2 className="w-3 h-3" />
                                                                <span>{record.user.department.name}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Briefcase className="w-3 h-3" />
                                                                <span>{record.user.employmentType}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* EPF Usage Progress */}
                                            <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100/30 shadow-sm hover:shadow-md transition-all duration-200">
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                                    <TrendingUp className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-green-800 mb-3">EPF Usage</p>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-700 font-medium">Used: {formatCurrency(record.expense)}</span>
                                                            <span className="text-gray-700 font-medium">Limit: {formatCurrency(record.maxEpf)}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200/80 rounded-full h-3 shadow-inner">
                                                            <div
                                                                className={`h-3 rounded-full transition-all duration-500 shadow-sm ${usagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                                        usagePercentage >= 75 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                                            'bg-gradient-to-r from-green-500 to-emerald-600'
                                                                    }`}
                                                                style={{ width: `${usagePercentage}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className={`font-semibold ${usagePercentage >= 90 ? 'text-red-600' :
                                                                    usagePercentage >= 75 ? 'text-orange-600' :
                                                                        'text-green-600'
                                                                }`}>
                                                                {usagePercentage.toFixed(1)}% Used
                                                            </span>
                                                            <span className="text-gray-700 font-medium">
                                                                Remaining: {formatCurrency(remainingAmount)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Financial Details */}
                                            <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-100/30 shadow-sm hover:shadow-md transition-all duration-200">
                                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                                    <DollarSign className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-yellow-800 mb-3">Financial Information</p>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="bg-white/50 rounded-lg p-3 border border-gray-100">
                                                            <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Basic Salary</p>
                                                            <p className="font-semibold text-gray-900 text-base">{formatCurrency(record.user.basicSalary)}</p>
                                                        </div>
                                                        <div className="bg-white/50 rounded-lg p-3 border border-gray-100">
                                                            <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">EPF Expense</p>
                                                            <p className="font-semibold text-gray-900 text-base">{formatCurrency(record.expense)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timestamps */}
                                            <div className="flex items-center justify-between pt-3 mt-2 border-t border-blue-200/50 text-sm text-gray-500 bg-white/30 rounded-lg px-4 py-3 backdrop-blur-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-blue-500" />
                                                    <span>Created {formatDate(record.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Edit3 className="w-4 h-4 text-blue-500" />
                                                    <span>Updated {formatDate(record.updatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Edit Modal */}
            <ModalBackdrop show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Edit3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Edit EPF Record</h2>
                        </div>
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                EPF Expense Amount
                            </label>
                            <input
                                type="number"
                                value={editData.expense}
                                onChange={(e) => setEditData({ ...editData, expense: e.target.value })}
                                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="Enter EPF expense amount"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Year
                            </label>
                            <input
                                type="number"
                                value={editData.year}
                                onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="Enter year"
                                min="2000"
                                max="2030"
                                required
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleEditSubmit}
                                disabled={isLoading || !editData.expense || !editData.year}
                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                            </button>
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
                            <h2 className="text-xl font-bold text-gray-900">Delete EPF Record</h2>
                            <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                        </div>
                    </div>

                    {selectedRecord && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800">
                                Are you sure you want to delete the EPF record for <strong>"{selectedRecord.user.name}"</strong>
                                (EPF: {selectedRecord.user.epfNumber}) for year {new Date(selectedRecord.year).getFullYear()}?
                                This will permanently remove the record and all associated data.
                            </p>
                        </div>
                    )}

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
                            <span>{isLoading ? 'Deleting...' : 'Delete Record'}</span>
                        </button>
                    </div>
                </div>
            </ModalBackdrop>
        </>
    );
};

export default EpfWFullCard;