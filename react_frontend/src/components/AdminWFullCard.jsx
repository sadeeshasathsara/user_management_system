import React, { useState } from 'react';
import {
    Shield,
    Edit3,
    Trash2,
    X,
    Save,
    AlertTriangle,
    Calendar,
    User,
    Mail,
    Badge,
    CheckCircle,
    Search,
    ChevronDown,
    ChevronUp,
    UserCheck,
    UserX,
    Power,
    PowerOff
} from 'lucide-react';

const AdminWFullCard = ({ adminRecords: initialAdminRecords }) => {
    // Mock admin records if none provided
    const defaultAdminRecords = [
        {
            _id: '1',
            email: 'admin@company.com',
            epfNo: 12345,
            isActive: true,
            createdAt: '2024-01-10T08:30:00Z',
            updatedAt: '2024-07-25T16:45:00Z'
        },
        {
            _id: '2',
            email: 'superadmin@company.com',
            epfNo: 67890,
            isActive: true,
            createdAt: '2024-02-15T09:15:00Z',
            updatedAt: '2024-07-20T11:30:00Z'
        },
        {
            _id: '3',
            email: 'hr.admin@company.com',
            epfNo: 11111,
            isActive: false,
            createdAt: '2024-03-20T10:45:00Z',
            updatedAt: '2024-06-10T14:20:00Z'
        }
    ];

    const [adminRecords, setAdminRecords] = useState(
        initialAdminRecords || defaultAdminRecords.map(admin => ({ ...admin, isActive: admin.isActive ?? true }))
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editData, setEditData] = useState({
        email: '',
        epfNo: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Filter admin records based on search term
    const filteredAdminRecords = adminRecords.filter(record =>
        record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.epfNo.toString().includes(searchTerm) ||
        (record.isActive ? 'active' : 'inactive').includes(searchTerm.toLowerCase())
    );

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

    // Handle edit form submission (now only for demonstration - fields are read-only)
    const handleEditSubmit = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real scenario, this would be disabled since admin info can't be edited
            const updatedRecords = adminRecords.map(record =>
                record._id === selectedRecord._id
                    ? {
                        ...record,
                        // email: editData.email, // Commented out - no longer editable
                        // epfNo: parseInt(editData.epfNo), // Commented out - no longer editable
                        updatedAt: new Date().toISOString()
                    }
                    : record
            );

            setAdminRecords(updatedRecords);
            setShowEditModal(false);
            setSelectedRecord(null);
            showSuccess('Admin account viewed successfully!');
        } catch (error) {
            console.error('Error viewing admin account:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle account status toggle
    const handleToggleStatus = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const updatedRecords = adminRecords.map(record =>
                record._id === selectedRecord._id
                    ? {
                        ...record,
                        isActive: !record.isActive,
                        updatedAt: new Date().toISOString()
                    }
                    : record
            );

            setAdminRecords(updatedRecords);
            setShowToggleModal(false);
            const newStatus = !selectedRecord.isActive;
            setSelectedRecord(null);
            showSuccess(`Admin account ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        } catch (error) {
            console.error('Error toggling admin status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const updatedRecords = adminRecords.filter(record => record._id !== selectedRecord._id);
            setAdminRecords(updatedRecords);
            setShowDeleteModal(false);
            setSelectedRecord(null);
            setExpandedCard(null);
            showSuccess('Admin account deleted successfully!');
        } catch (error) {
            console.error('Error deleting admin account:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Open edit modal (now view-only)
    const openEditModal = (record) => {
        setSelectedRecord(record);
        setEditData({
            email: record.email,
            epfNo: record.epfNo.toString()
        });
        setShowEditModal(true);
    };

    // Open toggle modal
    const openToggleModal = (record) => {
        setSelectedRecord(record);
        setShowToggleModal(true);
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
                            placeholder="Search by email, EPF number, or account status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 outline-none"
                        />
                    </div>
                    {searchTerm && (
                        <p className="text-sm text-gray-600 mt-2">
                            Found {filteredAdminRecords.length} admin{filteredAdminRecords.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Admin Records */}
                {filteredAdminRecords.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No admin accounts found matching your search.</p>
                    </div>
                ) : (
                    filteredAdminRecords.map((record) => {
                        const isExpanded = expandedCard === record._id;

                        return (
                            <div
                                key={record._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                            >
                                {/* Clickable Header */}
                                <div
                                    className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100 cursor-pointer hover:from-purple-100 hover:to-indigo-100 hover:shadow-md transition-all duration-200 group"
                                    onClick={() => toggleCard(record._id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                                <Shield className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex items-center justify-between flex-1">
                                                <div className="w-64 min-w-64">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email Address</p>
                                                    <p className="font-semibold text-gray-900 truncate">{record.email}</p>
                                                </div>
                                                <div className="w-32 min-w-32 text-center">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">EPF Number</p>
                                                    <p className="font-semibold text-gray-900">{record.epfNo}</p>
                                                </div>
                                                <div className="w-32 min-w-32 text-center">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {record.isActive ? (
                                                            <>
                                                                <UserCheck className="w-3 h-3 mr-1" />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserX className="w-3 h-3 mr-1" />
                                                                Inactive
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            {isExpanded && (
                                                <div className="flex items-center space-x-1 mr-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditModal(record);
                                                        }}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-lg transition-all duration-200 transform hover:scale-105"
                                                        title="View Admin Details"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openToggleModal(record);
                                                        }}
                                                        className={`p-2 hover:bg-opacity-20 rounded-lg transition-all duration-200 transform hover:scale-105 ${record.isActive
                                                            ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-200'
                                                            : 'text-green-600 hover:text-green-800 hover:bg-green-200'
                                                            }`}
                                                        title={record.isActive ? 'Deactivate Account' : 'Activate Account'}
                                                    >
                                                        {record.isActive ? (
                                                            <PowerOff className="w-4 h-4" />
                                                        ) : (
                                                            <Power className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteModal(record);
                                                        }}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                                                        title="Delete Admin"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="group-hover:text-purple-600 transition-colors duration-200">
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
                                    <div className="bg-gradient-to-br from-purple-25 via-slate-50 to-indigo-25 px-6 py-6 animate-in slide-in-from-top duration-300 border-t border-purple-100/50">
                                        <div className="space-y-6">
                                            {/* Admin Information */}
                                            <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-100/30 shadow-sm hover:shadow-md transition-all duration-200">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-purple-800 mb-3">Administrator Details</p>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center space-x-3">
                                                            <Mail className="w-4 h-4 text-gray-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Email Address</p>
                                                                <p className="text-gray-900 font-medium">{record.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <Badge className="w-4 h-4 text-gray-500" />
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide">EPF Number</p>
                                                                <p className="text-gray-900 font-medium">{record.epfNo}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Account Status */}
                                            <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100/30 shadow-sm hover:shadow-md transition-all duration-200">
                                                <div className={`w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${record.isActive
                                                    ? 'from-green-500 to-emerald-600'
                                                    : 'from-red-500 to-red-600'
                                                    }`}>
                                                    {record.isActive ? (
                                                        <UserCheck className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <UserX className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-semibold mb-2 ${record.isActive ? 'text-green-800' : 'text-red-800'
                                                        }`}>
                                                        Account Status
                                                    </p>
                                                    <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${record.isActive
                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                        : 'bg-red-100 text-red-800 border border-red-200'
                                                        }`}>
                                                        {record.isActive ? (
                                                            <>
                                                                <UserCheck className="w-4 h-4 mr-2" />
                                                                Active - Full access granted
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserX className="w-4 h-4 mr-2" />
                                                                Inactive - Access restricted
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timestamps */}
                                            <div className="flex items-center justify-between pt-3 mt-2 border-t border-purple-200/50 text-sm text-gray-500 bg-white/30 rounded-lg px-4 py-3 backdrop-blur-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-purple-500" />
                                                    <span>Created {formatDate(record.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Edit3 className="w-4 h-4 text-purple-500" />
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

            {/* Edit Modal - Now View Only */}
            <ModalBackdrop show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Edit3 className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">View Admin Account</h2>
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
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={editData.email}
                                readOnly
                                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                placeholder="Enter email address"
                            />
                            <p className="text-xs text-gray-500 mt-1">Admin information cannot be modified</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                EPF Number
                            </label>
                            <input
                                type="number"
                                value={editData.epfNo}
                                readOnly
                                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                placeholder="Enter EPF number"
                            />
                            <p className="text-xs text-gray-500 mt-1">Admin information cannot be modified</p>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </ModalBackdrop>

            {/* Account Status Toggle Modal */}
            <ModalBackdrop show={showToggleModal} onClose={() => setShowToggleModal(false)}>
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedRecord?.isActive
                            ? 'bg-orange-100'
                            : 'bg-green-100'
                            }`}>
                            {selectedRecord?.isActive ? (
                                <PowerOff className="w-6 h-6 text-orange-600" />
                            ) : (
                                <Power className="w-6 h-6 text-green-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedRecord?.isActive ? 'Deactivate' : 'Activate'} Admin Account
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                This will {selectedRecord?.isActive ? 'restrict' : 'restore'} account access
                            </p>
                        </div>
                    </div>

                    {selectedRecord && (
                        <div className={`border rounded-lg p-4 mb-6 ${selectedRecord.isActive
                            ? 'bg-orange-50 border-orange-200'
                            : 'bg-green-50 border-green-200'
                            }`}>
                            <p className={`${selectedRecord.isActive ? 'text-orange-800' : 'text-green-800'
                                }`}>
                                Are you sure you want to {selectedRecord.isActive ? 'deactivate' : 'activate'} the
                                admin account <strong>"{selectedRecord.email}"</strong>?
                                {selectedRecord.isActive
                                    ? ' This will prevent the user from accessing the admin panel.'
                                    : ' This will restore full admin access for this user.'
                                }
                            </p>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowToggleModal(false)}
                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleToggleStatus}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-3 text-white text-sm rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 ${selectedRecord?.isActive
                                ? 'bg-orange-600 hover:bg-orange-700'
                                : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {selectedRecord?.isActive ? (
                                <PowerOff className="w-4 h-4" />
                            ) : (
                                <Power className="w-4 h-4" />
                            )}
                            <span>
                                {isLoading
                                    ? 'Processing...'
                                    : selectedRecord?.isActive
                                        ? 'Deactivate Account'
                                        : 'Activate Account'
                                }
                            </span>
                        </button>
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
                            <h2 className="text-xl font-bold text-gray-900">Delete Admin Account</h2>
                            <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                        </div>
                    </div>

                    {selectedRecord && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800">
                                Are you sure you want to permanently delete the admin account
                                <strong> "{selectedRecord.email}"</strong> (EPF: {selectedRecord.epfNo})?
                                This will remove all admin privileges and cannot be reversed.
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
                            <span>{isLoading ? 'Deleting...' : 'Delete Account'}</span>
                        </button>
                    </div>
                </div>
            </ModalBackdrop>
        </>
    );
};

export default AdminWFullCard;