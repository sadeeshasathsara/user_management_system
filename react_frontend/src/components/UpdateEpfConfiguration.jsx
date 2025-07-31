import React, { useState, useEffect } from 'react';
import { Settings, AlertTriangle, Save, RefreshCcw, Shield, Lock, Database, X } from 'lucide-react';

const EPFConfigForm = () => {
    const [formData, setFormData] = useState({
        maxEpf: ''
    });
    const [originalMaxEpf, setOriginalMaxEpf] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch current EPF configuration on component mount
    useEffect(() => {
        fetchCurrentEPFConfig();
    }, []);

    // Check for changes
    useEffect(() => {
        setHasChanges(formData.maxEpf !== originalMaxEpf && formData.maxEpf !== '');
    }, [formData.maxEpf, originalMaxEpf]);

    const fetchCurrentEPFConfig = async () => {
        setFetchingData(true);
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/epf-config');
            const data = await response.json();

            if (response.ok) {
                const maxEpfValue = data.maxEpf?.toString() || '';
                setFormData({ maxEpf: maxEpfValue });
                setOriginalMaxEpf(maxEpfValue);
            } else {
                showNotification('error', 'Failed to fetch EPF configuration');
            }
        } catch (error) {
            console.error('Error fetching EPF config:', error);
            showNotification('error', 'Network error while fetching configuration');
        } finally {
            setFetchingData(false);
        }
    };

    const handleInputChange = (e) => {
        const { value } = e.target;

        // Only allow digits, no letters, special characters, or decimals
        const numericValue = value.replace(/[^0-9]/g, '');

        setFormData({ maxEpf: numericValue });

        // Real-time validation
        let error = '';
        if (numericValue.length === 0) {
            error = 'Maximum EPF value is required';
        } else if (parseInt(numericValue) <= 0) {
            error = 'Maximum EPF must be greater than 0';
        } else if (numericValue.length > 6) {
            error = 'Maximum EPF value seems too large';
        }

        setErrors({ maxEpf: error });
    };

    const handleKeyDown = (e) => {
        // Prevent typing non-numeric characters
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];

        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
        if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
            return;
        }

        // Allow numbers (0-9)
        if (e.key >= '0' && e.key <= '9') {
            return;
        }

        // Block everything else except allowed keys
        if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');

        // Extract only digits from pasted text
        const numericValue = pastedText.replace(/[^0-9]/g, '');

        setFormData({ maxEpf: numericValue });

        // Update error state
        let error = '';
        if (numericValue.length === 0) {
            error = 'Maximum EPF value is required';
        } else if (parseInt(numericValue) <= 0) {
            error = 'Maximum EPF must be greater than 0';
        }

        setErrors({ maxEpf: error });
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 8000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.maxEpf.trim()) {
            setErrors({ maxEpf: 'Maximum EPF value is required' });
            return;
        }

        if (parseInt(formData.maxEpf) <= 0) {
            setErrors({ maxEpf: 'Maximum EPF must be greater than 0' });
            return;
        }

        if (errors.maxEpf) {
            return;
        }

        // Show warning modal
        setShowWarningModal(true);
    };

    const handleConfirmUpdate = async () => {
        setShowWarningModal(false);
        setLoading(true);

        try {
            console.log('Updating EPF config:', { maxEpf: parseInt(formData.maxEpf) });

            // Replace with your actual API endpoint
            const response = await fetch('/api/epf-config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    maxEpf: parseInt(formData.maxEpf)
                })
            });

            const data = await response.json();

            if (response.ok) {
                setOriginalMaxEpf(formData.maxEpf);
                showNotification('success', 'EPF configuration updated successfully! Changes are now active.');
                setErrors({});
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else if (data.message) {
                    showNotification('error', data.message);
                } else {
                    showNotification('error', 'Failed to update EPF configuration');
                }
            }
        } catch (error) {
            console.error('Error updating EPF config:', error);
            showNotification('error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({ maxEpf: originalMaxEpf });
        setErrors({});
        setNotification(null);
    };

    const handleRefresh = () => {
        fetchCurrentEPFConfig();
        setErrors({});
        setNotification(null);
    };

    // Modal backdrop component
    const ModalBackdrop = ({ children, show, onClose }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                <div
                    className="absolute inset-0"
                    onClick={onClose}
                />
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4/7 sm:max-w-4/7  md:max-w-4/7 max-h-[90vh] overflow-y-auto z-10">
                    {children}
                </div>
            </div>
        );
    };

    if (fetchingData) {
        return (
            <div className="w-full mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-100 rounded-t-xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">EPF Configuration</h2>
                                <p className="text-sm text-gray-600">Loading current settings...</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Fetching EPF configuration...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="w-full mx-auto px-4">
                {/* Notification */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg border flex items-start space-x-3 ${notification.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {notification.type === 'success' ? (
                            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="flex-1">{notification.message}</span>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Warning Banner */}
                <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-red-900 mb-1">⚠️ Critical System Configuration</h3>
                            <p className="text-red-800 text-sm leading-relaxed">
                                <strong>WARNING:</strong> Modifying the maximum EPF value affects all employee accounts system-wide.
                                This change is immediate and irreversible. Ensure you understand the implications before proceeding.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border-2 border-orange-200">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b-2 border-orange-100 rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                                    <Settings className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">EPF Configuration</h2>
                                    <p className="text-sm text-red-600 font-medium">⚠️ System-wide settings</p>
                                </div>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Refresh configuration"
                            >
                                <RefreshCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Current Value Display */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <Database className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Current Maximum EPF Value</p>
                                    <p className="text-2xl font-bold text-gray-900">{originalMaxEpf || 'Not Set'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Max EPF Input */}
                        <div>
                            <label htmlFor="maxEpf" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Lock className="w-4 h-4 text-red-500" />
                                    <span>Maximum EPF Value <span className="text-red-500">*</span></span>
                                </div>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="maxEpf"
                                    name="maxEpf"
                                    value={formData.maxEpf}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    onPaste={handlePaste}
                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 ${errors.maxEpf
                                        ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                        : hasChanges
                                            ? 'border-orange-400 focus:ring-orange-500 focus:border-orange-500 bg-orange-50'
                                            : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                        }`}
                                    placeholder="Enter maximum EPF number (e.g., 99999)"
                                    disabled={loading}
                                />
                                {hasChanges && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
                                            Modified
                                        </span>
                                    </div>
                                )}
                            </div>
                            {errors.maxEpf && (
                                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>{errors.maxEpf}</span>
                                </p>
                            )}
                        </div>

                        {/* Impact Warning */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-red-800">
                                    <p className="font-medium mb-2">Impact of Changes:</p>
                                    <ul className="list-disc list-inside space-y-1 text-red-700">
                                        <li>All new employee EPF numbers must be within this limit</li>
                                        <li>Existing employees with EPF numbers above this limit will be flagged</li>
                                        <li>System validations will use this value immediately</li>
                                        <li>This affects payroll processing and employee management</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-gray-200">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading || !hasChanges}
                                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || !hasChanges || !!errors.maxEpf || !formData.maxEpf.trim()}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Update Configuration</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Warning Modal */}
                <ModalBackdrop show={showWarningModal} onClose={() => setShowWarningModal(false)}>
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-red-900">⚠️ Confirm Critical Change</h2>
                                    <p className="text-sm text-red-600 mt-1">This action affects the entire system</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="mb-8">
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                                <div className="text-center mb-4">
                                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-red-900 mb-2">DANGER ZONE</h3>
                                    <p className="text-red-800 font-medium">
                                        You are about to modify a critical system setting
                                    </p>
                                </div>

                                <div className="bg-white border border-red-300 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Current Maximum EPF:</span>
                                        <span className="font-bold text-gray-900 text-lg">{originalMaxEpf}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-red-700">New Maximum EPF:</span>
                                            <span className="font-bold text-red-900 text-lg">{formData.maxEpf}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm text-orange-800 font-medium mb-2">Before proceeding, confirm that:</p>
                                        <ul className="text-sm text-orange-700 space-y-1">
                                            <li>✓ You have proper authorization to make this change</li>
                                            <li>✓ You understand this affects all employee accounts</li>
                                            <li>✓ You have informed relevant stakeholders</li>
                                            <li>✓ This change is necessary and correct</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => setShowWarningModal(false)}
                                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 order-2 sm:order-1"
                                disabled={loading}
                            >
                                Cancel - Keep Current Setting
                            </button>
                            <button
                                onClick={handleConfirmUpdate}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 order-1 sm:order-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Updating System...</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Yes, Update EPF Configuration</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalBackdrop>

                {/* Additional Help */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-2">Best Practices:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li>Set the maximum EPF value higher than your current highest employee EPF number</li>
                                <li>Consider future growth when setting this limit</li>
                                <li>Document this change for audit purposes</li>
                                <li>Test the impact in a staging environment first if possible</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EPFConfigForm;