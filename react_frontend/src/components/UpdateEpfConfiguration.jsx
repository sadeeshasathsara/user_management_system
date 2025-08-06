import React, { useState, useEffect } from 'react';
import { Settings, AlertTriangle, Save, RefreshCcw, Shield, Lock, Database, X, Plus, Trash2, Users, Building, Award, UserCheck, Edit3, ChevronDown, ChevronRight } from 'lucide-react';
import { updateMaxEpf, getMaxEpf } from '../apis/epf.api';

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

    // EPF Range Management
    const [showRangeConfig, setShowRangeConfig] = useState(false);
    const [epfRanges, setEpfRanges] = useState([]);
    const [rangeErrors, setRangeErrors] = useState({});

    // Predefined range templates
    const rangeTemplates = [
        { name: 'Executive Level', description: 'Senior management and executive staff', icon: Award, suggestedRange: '80-100%' },
        { name: 'Management Level', description: 'Department heads and managers', icon: Users, suggestedRange: '60-80%' },
        { name: 'Senior Staff', description: 'Senior employees and specialists', icon: UserCheck, suggestedRange: '40-60%' },
        { name: 'Junior Staff', description: 'Entry-level and junior employees', icon: Building, suggestedRange: '20-40%' },
        { name: 'Trainee Level', description: 'Trainees and interns', icon: Edit3, suggestedRange: '1-20%' }
    ];

    // Fetch current EPF configuration on component mount
    useEffect(() => {
        fetchCurrentEPFConfig();
    }, []);

    // Track original ranges for change detection
    const [originalRanges, setOriginalRanges] = useState([]);

    // Check for changes
    useEffect(() => {
        const maxEpfChanged = formData.maxEpf !== originalMaxEpf && formData.maxEpf !== '';

        // Check if ranges have changed compared to original
        const currentValidRanges = epfRanges.filter(range => range.name.trim() && range.maxValue.trim());
        const rangesChanged = JSON.stringify(currentValidRanges.map(r => ({
            name: r.name.trim(),
            description: r.description?.trim() || '',
            maxValue: r.maxValue.trim(),
            icon: r.icon
        }))) !== JSON.stringify(originalRanges.map(r => ({
            name: r.name.trim(),
            description: r.description?.trim() || '',
            maxValue: r.maxValue.trim(),
            icon: r.icon
        })));

        setHasChanges(maxEpfChanged || rangesChanged);
    }, [formData.maxEpf, originalMaxEpf, epfRanges, originalRanges]);

    const fetchCurrentEPFConfig = async () => {
        setFetchingData(true);
        try {
            const response = await getMaxEpf();

            if (response.success) {
                const maxEpfValue = response.data.maxEpf?.toString() || '';
                setFormData({ maxEpf: maxEpfValue });
                setOriginalMaxEpf(maxEpfValue);

                // Load ranges if they exist
                if (response.data.ranges && Array.isArray(response.data.ranges)) {
                    const loadedRanges = response.data.ranges.map(range => ({
                        id: Date.now() + Math.random(), // Generate unique ID for frontend
                        name: range.name,
                        description: range.description || '',
                        maxValue: range.maxValue.toString(),
                        icon: range.icon || 'Users'
                    }));
                    setEpfRanges(loadedRanges);
                    setOriginalRanges(loadedRanges);
                } else {
                    setEpfRanges([]);
                    setOriginalRanges([]);
                }
            } else {
                showNotification('error', response.message || 'Failed to fetch EPF configuration');
            }
        } catch (error) {
            console.error('Error fetching EPF config:', error);
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || 'Server error while fetching configuration';
                showNotification('error', errorMessage);
            } else if (error.request) {
                // Request made but no response received
                showNotification('error', 'Network error - please check your connection');
            } else {
                // Something else happened
                showNotification('error', 'Unexpected error while fetching configuration');
            }
        } finally {
            setFetchingData(false);
        }
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        const numericValue = value.replace(/[^0-9]/g, '');
        setFormData({ maxEpf: numericValue });

        let error = '';
        if (numericValue.length === 0) {
            error = 'Maximum EPF value is required';
        } else if (parseInt(numericValue) <= 0) {
            error = 'Maximum EPF must be greater than 0';
        } else if (numericValue.length > 6) {
            error = 'Maximum EPF value seems too large';
        }

        setErrors({ maxEpf: error });

        // Update range validations when max EPF changes
        validateRanges(epfRanges, numericValue);
    };

    const handleKeyDown = (e) => {
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];

        if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
            return;
        }

        if (e.key >= '0' && e.key <= '9') {
            return;
        }

        if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const numericValue = pastedText.replace(/[^0-9]/g, '');

        setFormData({ maxEpf: numericValue });

        let error = '';
        if (numericValue.length === 0) {
            error = 'Maximum EPF value is required';
        } else if (parseInt(numericValue) <= 0) {
            error = 'Maximum EPF must be greater than 0';
        }

        setErrors({ maxEpf: error });
    };

    // Range Management Functions
    const addRange = (template = null) => {
        const newRange = {
            id: Date.now(),
            name: template ? template.name : '',
            description: template ? template.description : '',
            maxValue: '',
            icon: template ? template.icon : Users
        };
        setEpfRanges([...epfRanges, newRange]);
    };

    const updateRange = (id, field, value) => {
        const updatedRanges = epfRanges.map(range =>
            range.id === id ? { ...range, [field]: value } : range
        );
        setEpfRanges(updatedRanges);
        validateRanges(updatedRanges, formData.maxEpf);
    };

    const removeRange = (id) => {
        const updatedRanges = epfRanges.filter(range => range.id !== id);
        setEpfRanges(updatedRanges);

        // Clean up any errors for the removed range
        const newRangeErrors = { ...rangeErrors };
        delete newRangeErrors[id];
        setRangeErrors(newRangeErrors);

        // Validate remaining ranges
        validateRanges(updatedRanges, formData.maxEpf);
    };

    const validateRanges = (ranges, maxEpf) => {
        const newRangeErrors = {};
        const maxEpfValue = parseInt(maxEpf) || 0;

        // Calculate sum of all range maximum values
        const validRanges = ranges.filter(r => r.name.trim() && r.maxValue.trim());
        const sumOfRangeMaxValues = validRanges.reduce((sum, range) => {
            return sum + (parseInt(range.maxValue) || 0);
        }, 0);

        // Check if sum exceeds system maximum
        const sumExceedsMax = sumOfRangeMaxValues > maxEpfValue && maxEpfValue > 0 && validRanges.length > 0;

        ranges.forEach(range => {
            const rangeMaxValue = parseInt(range.maxValue) || 0;

            if (range.name.trim() && !range.maxValue.trim()) {
                newRangeErrors[range.id] = 'Maximum value is required when name is provided';
            } else if (range.maxValue.trim() && !range.name.trim()) {
                newRangeErrors[range.id] = 'Range name is required when maximum value is provided';
            } else if (rangeMaxValue > maxEpfValue && maxEpfValue > 0) {
                newRangeErrors[range.id] = `Range maximum (${rangeMaxValue}) cannot exceed system maximum (${maxEpfValue})`;
            } else if (rangeMaxValue <= 0 && range.maxValue.trim()) {
                newRangeErrors[range.id] = 'Range maximum must be greater than 0';
            }
        });

        // Add sum validation error to all ranges if sum exceeds maximum
        if (sumExceedsMax) {
            ranges.forEach(range => {
                if (range.name.trim() && range.maxValue.trim()) {
                    newRangeErrors[range.id] = `Sum of all ranges (${sumOfRangeMaxValues}) exceeds system maximum (${maxEpfValue}). Please reduce range values.`;
                }
            });
        }

        // Check for overlapping ranges (only if sum is valid)
        if (!sumExceedsMax) {
            const sortedRanges = ranges
                .filter(r => r.maxValue.trim() && r.name.trim())
                .sort((a, b) => parseInt(a.maxValue) - parseInt(b.maxValue));

            for (let i = 0; i < sortedRanges.length - 1; i++) {
                const current = sortedRanges[i];
                const next = sortedRanges[i + 1];
                if (parseInt(current.maxValue) >= parseInt(next.maxValue)) {
                    newRangeErrors[next.id] = 'Range values should not overlap with previous ranges';
                }
            }
        }

        setRangeErrors(newRangeErrors);
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

        if (errors.maxEpf || Object.keys(rangeErrors).length > 0) {
            return;
        }

        setShowWarningModal(true);
    };

    const handleConfirmUpdate = async () => {
        setShowWarningModal(false);
        setLoading(true);

        try {
            // Prepare the data for API call
            const updateData = {
                maxEpf: parseInt(formData.maxEpf)
            };

            // Add ranges if they exist and are valid
            const validRanges = epfRanges.filter(range =>
                range.name.trim() && range.maxValue.trim()
            );

            if (validRanges.length > 0) {
                updateData.ranges = validRanges.map(range => ({
                    name: range.name.trim(),
                    description: range.description?.trim() || '',
                    maxValue: range.maxValue.trim(),
                    icon: range.icon || 'Users'
                }));
            }

            console.log('Updating EPF config:', updateData);

            const response = await updateMaxEpf(updateData);

            if (response.success) {
                setOriginalMaxEpf(formData.maxEpf);

                // Update original ranges to reflect the new state
                const validRanges = epfRanges.filter(range =>
                    range.name.trim() && range.maxValue.trim()
                );
                setOriginalRanges(validRanges);

                showNotification('success', response.message || 'EPF configuration updated successfully! Changes are now active.');
                setErrors({});
                setRangeErrors({});

                // Refresh the data to get the latest state from server
                await fetchCurrentEPFConfig();
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                    showNotification('error', 'Please fix the validation errors and try again');
                } else {
                    showNotification('error', response.message || 'Failed to update EPF configuration');
                }
            }
        } catch (error) {
            console.error('Error updating EPF config:', error);

            if (error.response) {
                // Server responded with error status
                const errorData = error.response.data;
                if (errorData.errors) {
                    setErrors(errorData.errors);
                    showNotification('error', 'Please fix the validation errors and try again');
                } else {
                    showNotification('error', errorData.message || 'Server error occurred while updating configuration');
                }
            } else if (error.request) {
                // Request made but no response received
                showNotification('error', 'Network error - please check your connection and try again');
            } else {
                // Something else happened
                showNotification('error', 'Unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({ maxEpf: originalMaxEpf });
        setEpfRanges([...originalRanges]); // Reset to original ranges, not empty array
        setErrors({});
        setRangeErrors({});
        setNotification(null);
    };

    const handleRefresh = async () => {
        setErrors({});
        setRangeErrors({});
        setNotification(null);
        await fetchCurrentEPFConfig();
    };

    // Modal backdrop component
    const ModalBackdrop = ({ children, show, onClose }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                <div className="absolute inset-0" onClick={onClose} />
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10">
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Database className="w-5 h-5 text-gray-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Current Maximum EPF Value</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {originalMaxEpf ? `${originalMaxEpf}` : 'Not Set'}
                                        </p>
                                    </div>
                                </div>
                                {epfRanges.filter(r => r.name.trim() && r.maxValue.trim()).length > 0 && (
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-gray-600">Active Ranges</p>
                                        <p className="text-lg font-semibold text-blue-600">
                                            {epfRanges.filter(r => r.name.trim() && r.maxValue.trim()).length}
                                        </p>
                                    </div>
                                )}
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

                        {/* EPF Range Configuration Toggle */}
                        <div className="border-t border-gray-200 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowRangeConfig(!showRangeConfig)}
                                className="flex items-center space-x-3 w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200"
                            >
                                {showRangeConfig ? (
                                    <ChevronDown className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-blue-600" />
                                )}
                                <Users className="w-5 h-5 text-blue-600" />
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-semibold text-blue-900">EPF Range Management</h3>
                                    <p className="text-sm text-blue-700">Configure EPF number ranges for different employee categories (Optional)</p>
                                </div>
                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                                    {epfRanges.filter(r => r.name.trim() && r.maxValue.trim()).length} active ranges
                                </span>
                            </button>
                        </div>

                        {/* EPF Range Configuration */}
                        {showRangeConfig && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className='w-full flex items-center justify-between'>
                                        <div className=''>
                                            <h4 className="text-lg font-semibold text-blue-900">Configure EPF Ranges</h4>
                                            <p className="text-sm text-blue-700 mt-1">Define EPF number ranges for different employee levels or departments</p>
                                        </div>
                                        {/* Custom Range Button */}
                                        <button
                                            type="button"
                                            onClick={() => addRange()}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Custom Range</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Templates */}
                                <div className="bg-white border border-blue-200 rounded-lg p-4">
                                    <h5 className="text-sm font-medium text-gray-700 mb-3">Quick Templates:</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {rangeTemplates.map((template, index) => {
                                            const IconComponent = template.icon;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => addRange(template)}
                                                    className="flex items-center space-x-2 p-2 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200"
                                                >
                                                    <IconComponent className="w-4 h-4 text-gray-600" />
                                                    <span className="text-gray-700">{template.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>



                                {/* Range List */}
                                {epfRanges.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-sm font-medium text-gray-700">Configured Ranges:</h5>
                                            {(() => {
                                                const validRanges = epfRanges.filter(r => r.name.trim() && r.maxValue.trim());
                                                const sumOfRangeMaxValues = validRanges.reduce((sum, range) => {
                                                    return sum + (parseInt(range.maxValue) || 0);
                                                }, 0);
                                                const maxEpfValue = parseInt(formData.maxEpf) || 0;
                                                const sumExceedsMax = sumOfRangeMaxValues > maxEpfValue && maxEpfValue > 0 && validRanges.length > 0;

                                                return (
                                                    <div className={`text-right ${sumExceedsMax ? 'text-red-600' : 'text-gray-600'}`}>
                                                        <p className="text-xs font-medium">
                                                            Total Range Capacity: {sumOfRangeMaxValues.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs">
                                                            System Max: {maxEpfValue.toLocaleString()}
                                                            {sumExceedsMax && (
                                                                <span className="ml-2 text-red-500 font-semibold">⚠️ EXCEEDED</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        {epfRanges.map((range) => {
                                            const IconComponent = range.icon;
                                            const hasErrors = rangeErrors[range.id];

                                            return (
                                                <div key={range.id} className={`bg-white border rounded-lg p-4 transition-all duration-200 ${hasErrors ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                                    }`}>
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <IconComponent className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 space-y-3">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Range Name *</label>
                                                                    <input
                                                                        type="text"
                                                                        value={range.name}
                                                                        onChange={(e) => updateRange(range.id, 'name', e.target.value)}
                                                                        placeholder="e.g., Executive Level"
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Maximum EPF Value *</label>
                                                                    <input
                                                                        type="text"
                                                                        value={range.maxValue}
                                                                        onChange={(e) => {
                                                                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                                            updateRange(range.id, 'maxValue', numericValue);
                                                                        }}
                                                                        placeholder="e.g., 10000"
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                                                <textarea
                                                                    value={range.description}
                                                                    onChange={(e) => updateRange(range.id, 'description', e.target.value)}
                                                                    placeholder="Optional description for this range"
                                                                    rows={2}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                            {hasErrors && (
                                                                <p className="text-xs text-red-600 flex items-center space-x-1">
                                                                    <AlertTriangle className="w-3 h-3" />
                                                                    <span>{hasErrors}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeRange(range.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
                                                            title="Delete this range"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Range Info */}
                                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-medium mb-2">Range Guidelines:</p>
                                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                                <li>Ranges help organize EPF numbers by employee categories</li>
                                                <li>Each range maximum must be less than the system maximum</li>
                                                <li><strong>The sum of all range maximums cannot exceed the system maximum</strong></li>
                                                <li>Avoid overlapping ranges for better organization</li>
                                                <li>Ranges are optional and can be configured as needed</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Impact Warning */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-red-800">
                                    <p className="font-medium mb-2">Impact of Changes:</p>
                                    <ul className="list-disc list-inside space-y-1 text-red-700">
                                        <li>All new employee EPF numbers must be within the system limit</li>
                                        <li>Existing employees with EPF numbers above this limit will be flagged</li>
                                        <li>System validations will use this value immediately</li>
                                        <li>This affects payroll processing and employee management</li>
                                        {epfRanges.filter(r => r.name.trim() && r.maxValue.trim()).length > 0 &&
                                            <li>Configured ranges will help organize employee categories</li>
                                        }
                                        {originalRanges.length > 0 && epfRanges.filter(r => r.name.trim() && r.maxValue.trim()).length === 0 &&
                                            <li>All existing EPF ranges will be removed</li>
                                        }
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
                                disabled={loading || !hasChanges || !!errors.maxEpf || !formData.maxEpf.trim() || Object.keys(rangeErrors).length > 0}
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
                                    {epfRanges.filter(r => r.name.trim() && r.maxValue.trim()).length > 0 && (
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="text-sm font-medium text-blue-700 mb-2">EPF Ranges to be configured:</div>
                                            <div className="space-y-1">
                                                {epfRanges
                                                    .filter(r => r.name.trim() && r.maxValue.trim())
                                                    .sort((a, b) => parseInt(a.maxValue) - parseInt(b.maxValue))
                                                    .map((range, index) => (
                                                        <div key={range.id} className="flex justify-between items-center text-xs">
                                                            <span className="text-gray-600">{range.name}:</span>
                                                            <span className="font-medium text-gray-800">
                                                                {index === 0 ? '1' : (parseInt(epfRanges
                                                                    .filter(r => r.name.trim() && r.maxValue.trim())
                                                                    .sort((a, b) => parseInt(a.maxValue) - parseInt(b.maxValue))[index - 1].maxValue) + 1)} - {range.maxValue}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
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
                                            {epfRanges.filter(r => r.name.trim() && r.maxValue.trim()).length > 0 && (
                                                <li>✓ The EPF ranges are properly configured and non-overlapping</li>
                                            )}
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
                                <li>Use EPF ranges to organize employees by level, department, or joining date</li>
                                <li>Ensure ranges don't overlap and are in ascending order</li>
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