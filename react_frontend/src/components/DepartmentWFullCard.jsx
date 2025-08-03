import React, { useState } from 'react';
import {
    Building2,
    Edit3,
    Trash2,
    X,
    Save,
    AlertTriangle,
    Calendar,
    FileText,
    Users,
    CheckCircle
} from 'lucide-react';
import { deleteDepartment, updateDepartment } from '../apis/department.api';

const DepartmentWFullCard = ({ initialDepartment, employeeCount = 0 }) => {
    const [department, setDepartment] = useState(initialDepartment);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [editData, setEditData] = useState({
        _id: department._id,
        name: department.name,
        description: department.description
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

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

    // Handle edit form submission
    const handleEditSubmit = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await updateDepartment(editData);

            // Show success message
            showSuccess('Department updated successfully!');

            // Update department data
            const updatedDepartment = {
                ...department,
                ...editData,
                updatedAt: new Date().toISOString()
            };

            setDepartment(updatedDepartment);
            setShowEditModal(false);
            showSuccess('Department updated successfully!');

            console.log('Department updated:', updatedDepartment);
        } catch (error) {
            console.error('Error updating department:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            await deleteDepartment(department._id);

            setIsDeleted(true);
            setShowDeleteModal(false);
            showSuccess('Department deleted successfully!');

            console.log('Department deleted:', department._id);
        } catch (error) {
            console.error('Error deleting department:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset edit data when modal opens
    const openEditModal = () => {
        setEditData({
            _id: department._id,
            name: department.name,
            description: department.description
        });
        setShowEditModal(true);
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

    // If deleted, show deleted state
    if (isDeleted) {
        return (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Department Deleted</h3>
                <p className="text-red-700">The department has been successfully removed from the system.</p>
            </div>
        );
    }

    return (
        <>
            <SuccessNotification />

            {/* Main Department Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                    {department.name}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Created {formatDate(department.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employee Count Badge & Action Buttons */}
                        <div className="flex items-center space-x-3">
                            {/* Employee Count Badge */}
                            <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                                <Users className="w-4 h-4 mr-1.5" />
                                <span>{employeeCount} {employeeCount === 1 ? 'Employee' : 'Employees'}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={openEditModal}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                                    title="Edit Department"
                                >
                                    <Edit3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                                    title="Delete Department"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-5">
                    <div className="space-y-4">
                        {/* Description */}
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                                <p className="text-gray-600 leading-relaxed">
                                    {department.description}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Users className="w-4 h-4" />
                                <span>
                                    {employeeCount > 0
                                        ? `${employeeCount} active ${employeeCount === 1 ? 'employee' : 'employees'}`
                                        : 'No employees assigned'
                                    }
                                </span>
                            </div>
                            <div className="text-sm text-gray-400">
                                Updated {formatDate(department.updatedAt)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <ModalBackdrop show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Edit3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Edit Department</h2>
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
                                Department Name
                            </label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="Enter department name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                rows={4}
                                className="w-full outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                                placeholder="Enter department description"
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
                                disabled={isLoading || !editData.name.trim() || !editData.description.trim()}
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
                <div className="p-6 ">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Delete Department</h2>
                            <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">
                            Are you sure you want to delete <strong>"{department.name}"</strong>?
                            This will permanently remove the department and all associated data.
                        </p>
                        {employeeCount > 0 && (
                            <p className="text-red-800 mt-2 font-medium">
                                Warning: This department has {employeeCount} active {employeeCount === 1 ? 'employee' : 'employees'}.
                            </p>
                        )}
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
                            <span>{isLoading ? 'Deleting...' : 'Delete Department'}</span>
                        </button>
                    </div>
                </div>
            </ModalBackdrop>
        </>
    );
};

export default DepartmentWFullCard;