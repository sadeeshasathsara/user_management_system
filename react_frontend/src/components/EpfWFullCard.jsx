import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    ChevronUp,
    Target,
    CreditCard,
    BarChart3,
    Activity
} from 'lucide-react';
import { createOrUpdateEmployeeEpf, deleteEmployeeEpf, getMaxEpf } from '../apis/epf.api';

const EpfWFullCard = ({ epfRecords: initialEpfRecords }) => {
    const [allEpfRecords, setAllEpfRecords] = useState([]);
    const [filteredEpfRecords, setFilteredEpfRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUrlFiltered, setIsUrlFiltered] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [expenseType, setExpenseType] = useState(''); // 'range' or 'regular'
    const [rangeIndex, setRangeIndex] = useState(null);
    const [expenseIndex, setExpenseIndex] = useState(null);
    const [editData, setEditData] = useState({
        amount: '',
        expensedAt: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();



    // Set EPF records on component mount
    useEffect(() => {
        if (initialEpfRecords) {
            // Handle nested data structure
            const records = Array.isArray(initialEpfRecords) ? initialEpfRecords :
                initialEpfRecords.data?.data || initialEpfRecords.data || [];
            setAllEpfRecords(records);
            setFilteredEpfRecords(records);
            console.log(initialEpfRecords);

        } else {
            setAllEpfRecords([]);
            setFilteredEpfRecords([]);
        }
    }, [initialEpfRecords]);

    const handleClearFilters = () => {
        const params = new URLSearchParams(location.search);
        params.delete('id');
        const newSearch = params.toString();
        navigate({
            pathname: location.pathname,
            search: newSearch ? `?${newSearch}` : ''
        });
    };

    // Handle URL parameter filtering
    useEffect(() => {
        if (allEpfRecords.length === 0) return;

        const urlParams = new URLSearchParams(location.search);
        const id = urlParams.get('id');

        if (id) {
            const filteredRecords = allEpfRecords.filter(record =>
                String(record._id).trim() === String(id).trim()
            );
            setFilteredEpfRecords(filteredRecords);
            setIsUrlFiltered(true);
        } else {
            setFilteredEpfRecords(allEpfRecords);
            setIsUrlFiltered(false);
        }
    }, [location.search, allEpfRecords]);

    // Handle search filtering with useCallback to prevent re-renders
    const performSearch = useCallback(() => {
        if (isUrlFiltered) return;

        if (!searchTerm.trim()) {
            setFilteredEpfRecords(allEpfRecords);
            return;
        }

        const filtered = allEpfRecords.filter(record =>
            record.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.user?.epfNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            new Date(record.year).getFullYear().toString().includes(searchTerm)
        );
        setFilteredEpfRecords(filtered);
    }, [searchTerm, allEpfRecords, isUrlFiltered]);

    useEffect(() => {
        if (isUrlFiltered) return;
        const timeoutId = setTimeout(() => {
            performSearch();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [performSearch]);

    // Calculate total expenses for a record
    const calculateTotalExpenses = (record) => {
        return record.expense || 0;
    };

    // Calculate range expenses total
    const calculateRangeExpensesTotal = (record) => {
        if (!record.rangeExpenses) return 0;
        return record.rangeExpenses.reduce((total, range) => total + (range.expense || 0), 0);
    };

    // Calculate regular expenses total
    const calculateRegularExpensesTotal = (record) => {
        return record.regularExpenses?.expense || 0;
    };

    const [maxEpf, setMaxEpf] = useState(null);
    useEffect(() => {
        const fetchMaxEpf = async () => {
            try {
                const response = await getMaxEpf();
                if (response.success) {
                    setMaxEpf(response.data.maxEpf);
                }
            } catch (error) {
                console.error("Error fetching max EPF:", error);
            }
        };
        fetchMaxEpf();
    }, []);

    // Calculate EPF usage percentage
    const calculateUsagePercentage = (record) => {
        const totalExpenses = calculateTotalExpenses(record);
        return Math.min((totalExpenses / maxEpf) * 100, 100);
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

    // Format date for input
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
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

    // Open edit modal for range expense
    const openEditRangeExpenseModal = (record, rangeIdx, expenseIdx) => {
        const expense = record.rangeExpenses[rangeIdx].expenses[expenseIdx];
        setSelectedRecord(record);
        setSelectedExpense(expense);
        setExpenseType('range');
        setRangeIndex(rangeIdx);
        setExpenseIndex(expenseIdx);
        setEditData({
            amount: expense.amount.toString(),
            expensedAt: formatDateForInput(expense.expensedAt)
        });
        setShowEditModal(true);
    };

    // Open edit modal for regular expense
    const openEditRegularExpenseModal = (record, expenseIdx) => {
        const expense = record.regularExpenses.items[expenseIdx];
        setSelectedRecord(record);
        setSelectedExpense(expense);
        setExpenseType('regular');
        setExpenseIndex(expenseIdx);
        setEditData({
            amount: expense.amount.toString(),
            expensedAt: formatDateForInput(expense.expensedAt)
        });
        setShowEditModal(true);
    };

    // Open delete modal for range expense
    const openDeleteRangeExpenseModal = (record, rangeIdx, expenseIdx) => {
        const expense = record.rangeExpenses[rangeIdx].expenses[expenseIdx];
        setSelectedRecord(record);
        setSelectedExpense(expense);
        setExpenseType('range');
        setRangeIndex(rangeIdx);
        setExpenseIndex(expenseIdx);
        setShowDeleteModal(true);
    };

    // Open delete modal for regular expense
    const openDeleteRegularExpenseModal = (record, expenseIdx) => {
        const expense = record.regularExpenses.items[expenseIdx];
        setSelectedRecord(record);
        setSelectedExpense(expense);
        setExpenseType('regular');
        setExpenseIndex(expenseIdx);
        setShowDeleteModal(true);
    };

    // Handle edit form submission
    const handleEditSubmit = async () => {
        setIsLoading(true);
        try {
            // Prepare the updated record data for API
            const updatedRecord = { ...selectedRecord };

            if (expenseType === 'range') {
                // Update the specific range expense
                updatedRecord.rangeExpenses[rangeIndex].expenses[expenseIndex] = {
                    amount: parseFloat(editData.amount),
                    expensedAt: new Date(editData.expensedAt).toISOString()
                };

                // Recalculate range expense total
                updatedRecord.rangeExpenses[rangeIndex].expense = updatedRecord.rangeExpenses[rangeIndex].expenses
                    .reduce((total, exp) => total + exp.amount, 0);
            } else if (expenseType === 'regular') {
                // Update the specific regular expense
                updatedRecord.regularExpenses.items[expenseIndex] = {
                    amount: parseFloat(editData.amount),
                    expensedAt: new Date(editData.expensedAt).toISOString()
                };

                // Recalculate regular expense total
                updatedRecord.regularExpenses.expense = updatedRecord.regularExpenses.items
                    .reduce((total, exp) => total + exp.amount, 0);
            }

            // Prepare API payload
            const apiPayload = {
                user: updatedRecord.user._id,
                year: new Date(updatedRecord.year).getFullYear().toString(),
                rangeExpenses: updatedRecord.rangeExpenses.map(range => ({
                    name: range.name,
                    expenses: range.expenses.map(expense => ({
                        amount: expense.amount,
                        expensedAt: expense.expensedAt
                    }))
                })),
                regularExpenses: updatedRecord.regularExpenses.items.map(expense => ({
                    amount: expense.amount,
                    expensedAt: expense.expensedAt
                }))
            };

            // Call API to update
            const response = await createOrUpdateEmployeeEpf(apiPayload);

            if (response.success) {
                // Update local state with response data
                const updatedRecords = allEpfRecords.map(record =>
                    record._id === selectedRecord._id ? response.data : record
                );

                setAllEpfRecords(updatedRecords);
                setFilteredEpfRecords(prev => prev.map(record =>
                    updatedRecords.find(updated => updated._id === record._id) || record
                ));

                setShowEditModal(false);
                resetModalState();
                showSuccess('Expense updated successfully!');
                window.location.reload()
            } else {
                throw new Error(response.message || 'Failed to update expense');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            showSuccess('❌ Error updating expense. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            let deletePayload;

            if (expenseType === 'range') {
                const range = selectedRecord.rangeExpenses[rangeIndex];
                const rangeName = range.name;
                const expense = range.expenses[expenseIndex];
                const createdAt = expense?.createdAt;

                if (!createdAt) throw new Error("Missing createdAt for range expense");

                deletePayload = {
                    type: "range",
                    rangeName,
                    createdAt,
                };
            } else if (expenseType === 'regular') {
                const expense = selectedRecord.regularExpenses.items[expenseIndex];
                const createdAt = expense?.createdAt;

                if (!createdAt) throw new Error("Missing createdAt for regular expense");

                deletePayload = {
                    type: "regular",
                    createdAt,
                };
            }

            const response = await deleteEmployeeEpf(selectedRecord._id, deletePayload);

            if (response.success) {
                const updatedRecords = allEpfRecords.map(record => {
                    if (record._id === selectedRecord._id) {
                        const updatedRecord = JSON.parse(JSON.stringify(record)); // Deep clone

                        if (expenseType === 'range') {
                            updatedRecord.rangeExpenses[rangeIndex].expenses = updatedRecord.rangeExpenses[rangeIndex].expenses.filter(
                                exp => exp.createdAt !== deletePayload.createdAt
                            );

                            updatedRecord.rangeExpenses[rangeIndex].expense =
                                updatedRecord.rangeExpenses[rangeIndex].expenses.reduce((total, exp) => total + exp.amount, 0);
                        } else if (expenseType === 'regular') {
                            updatedRecord.regularExpenses.items = updatedRecord.regularExpenses.items.filter(
                                exp => exp.createdAt !== deletePayload.createdAt
                            );

                            updatedRecord.regularExpenses.expense =
                                updatedRecord.regularExpenses.items.reduce((total, exp) => total + exp.amount, 0);
                        }

                        const rangeTotal = updatedRecord.rangeExpenses?.reduce((total, range) => total + (range.expense || 0), 0) || 0;
                        const regularTotal = updatedRecord.regularExpenses?.expense || 0;
                        updatedRecord.expense = rangeTotal + regularTotal;
                        updatedRecord.updatedAt = new Date().toISOString();

                        return updatedRecord;
                    }
                    return record;
                });

                setAllEpfRecords(updatedRecords);
                setFilteredEpfRecords(prev =>
                    prev.map(record =>
                        updatedRecords.find(updated => updated._id === record._id) || record
                    )
                );

                setShowDeleteModal(false);
                resetModalState();
                showSuccess('Expense deleted successfully!');
            } else {
                throw new Error(response.message || 'Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            showSuccess('❌ Error deleting expense. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    // Memoize the edit data handlers to prevent re-renders
    const handleAmountChange = useCallback((e) => {
        setEditData(prev => ({ ...prev, amount: e.target.value }));
    }, []);

    const handleDateChange = useCallback((e) => {
        setEditData(prev => ({ ...prev, expensedAt: e.target.value }));
    }, []);

    // Reset modal state
    const resetModalState = useCallback(() => {
        setSelectedRecord(null);
        setSelectedExpense(null);
        setExpenseType('');
        setRangeIndex(null);
        setExpenseIndex(null);
        setEditData({ amount: '', expensedAt: '' });
    }, []);

    // Progress bar component
    const ProgressBar = ({ percentage, amount, maxAmount, size = "md" }) => {
        const getColorClass = (percent) => {
            if (percent >= 90) return 'from-red-500 to-red-600';
            if (percent >= 75) return 'from-yellow-500 to-orange-500';
            return 'from-green-500 to-emerald-600';
        };

        const getTextColor = (percent) => {
            if (percent >= 90) return 'text-red-600';
            if (percent >= 75) return 'text-orange-600';
            return 'text-green-600';
        };

        const sizeClasses = {
            sm: 'h-2',
            md: 'h-3',
            lg: 'h-4'
        };

        return (
            <div className="w-full">
                <div className={`w-full bg-gray-200/80 rounded-full ${sizeClasses[size]} shadow-inner overflow-hidden`}>
                    <div
                        className={`${sizeClasses[size]} rounded-full transition-all duration-700 ease-out shadow-sm bg-gradient-to-r ${getColorClass(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between items-center mt-1 text-xs">
                    <span className={`font-semibold ${getTextColor(percentage)}`}>
                        {percentage.toFixed(1)}%
                    </span>
                    <span className="text-gray-600">
                        {formatCurrency(amount)} / {formatCurrency(maxAmount)}
                    </span>
                </div>
            </div>
        );
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
            {maxEpf && (
                <>
                    <SuccessNotification />

                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by employee name, email, or year..."
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

                        <div className='w-full text-right'>
                            <p onClick={handleClearFilters} className='mr-1 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors'>Clear Filters</p>
                        </div>

                        {/* EPF Records */}
                        {filteredEpfRecords.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No EPF records found matching your search.</p>
                            </div>
                        ) : (
                            filteredEpfRecords.map((record) => {
                                const totalExpenses = calculateTotalExpenses(record);
                                const rangeExpensesTotal = calculateRangeExpensesTotal(record);
                                const regularExpensesTotal = calculateRegularExpensesTotal(record);
                                const usagePercentage = calculateUsagePercentage(record);
                                const isExpanded = expandedCard === record._id;
                                const remainingAmount = Math.max(maxEpf - totalExpenses, 0);

                                return (
                                    <div
                                        key={record._id}
                                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                                    >
                                        {/* Clickable Header */}
                                        <div
                                            className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100 cursor-pointer hover:from-blue-100 hover:to-indigo-100 hover:shadow-md transition-all duration-200 group"
                                            onClick={() => toggleCard(record._id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 flex-1">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                                                        <Wallet className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div>
                                                                <h3 className="font-bold text-lg text-gray-900">{`${record.user?.name} (EPF: ${record.user?.epfNumber})` || 'N/A'}</h3>
                                                                <p className="text-sm text-gray-600">{record.user?.email || 'N/A'}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Year</p>
                                                                <p className="font-bold text-lg text-gray-900">{new Date(record.year).getFullYear()}</p>
                                                            </div>
                                                        </div>

                                                        {/* Quick Stats Row */}
                                                        <div className="grid grid-cols-3 gap-4 mb-3">
                                                            <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Expenses</p>
                                                                <p className="font-bold text-blue-700">{formatCurrency(totalExpenses)}</p>
                                                            </div>
                                                            <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Range Expenses</p>
                                                                <p className="font-bold text-purple-700">{formatCurrency(rangeExpensesTotal)}</p>
                                                            </div>
                                                            <div className="bg-white/70 rounded-lg p-3 border border-orange-100">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Regular Expenses</p>
                                                                <p className="font-bold text-orange-700">{formatCurrency(regularExpensesTotal)}</p>
                                                            </div>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="mb-2">
                                                            <ProgressBar
                                                                percentage={usagePercentage}
                                                                amount={totalExpenses}
                                                                maxAmount={maxEpf}
                                                                size="md"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2 ml-4">
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
                                            <div className="bg-gradient-to-br from-slate-50 via-blue-25 to-indigo-25 px-6 py-6 animate-in slide-in-from-top duration-300 border-t border-blue-100/50">
                                                <div className="space-y-6">
                                                    {/* Employee Information */}
                                                    {record.user && (
                                                        <div className="flex items-start space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-200">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                                <User className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-blue-800 mb-3">Employee Details</p>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                                                                        <p className="text-gray-900 font-medium">{record.user.name}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                                                                        <p className="text-gray-600 text-sm break-all">{record.user.email}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* EPF Usage Summary with Enhanced Progress */}
                                                    <div className="flex items-start space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-green-100/50 shadow-sm hover:shadow-md transition-all duration-200">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                            <BarChart3 className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-green-800 mb-4">EPF Usage Overview</p>
                                                            <div className="space-y-4">
                                                                <ProgressBar
                                                                    percentage={usagePercentage}
                                                                    amount={totalExpenses}
                                                                    maxAmount={maxEpf}
                                                                    size="lg"
                                                                />
                                                                <div className="grid grid-cols-3 gap-3 text-sm">
                                                                    <div className="bg-green-50/70 rounded-lg p-3 text-center border border-green-100">
                                                                        <p className="text-green-600 font-semibold">{formatCurrency(totalExpenses)}</p>
                                                                        <p className="text-xs text-gray-500">Used</p>
                                                                    </div>
                                                                    <div className="bg-blue-50/70 rounded-lg p-3 text-center border border-blue-100">
                                                                        <p className="text-blue-600 font-semibold">{formatCurrency(remainingAmount)}</p>
                                                                        <p className="text-xs text-gray-500">Remaining</p>
                                                                    </div>
                                                                    <div className="bg-gray-50/70 rounded-lg p-3 text-center border border-gray-100">
                                                                        <p className="text-gray-600 font-semibold">{formatCurrency(maxEpf)}</p>
                                                                        <p className="text-xs text-gray-500">Limit</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Range Expenses */}
                                                    {record.rangeExpenses && record.rangeExpenses.length > 0 && (
                                                        <div className="flex items-start space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-100/50 shadow-sm hover:shadow-md transition-all duration-200">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                                <Target className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-purple-800 mb-4">Range Expenses</p>
                                                                <div className="space-y-4">
                                                                    {record.rangeExpenses.map((range, rangeIndex) => (
                                                                        <div key={rangeIndex} className="bg-white/90 rounded-lg p-4 border border-purple-100">
                                                                            <div className="flex justify-between items-center mb-3">
                                                                                <h4 className="font-semibold text-purple-700">{range.name}</h4>
                                                                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                                                                    {formatCurrency(range.expense || 0)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                {range.expenses && range.expenses.map((expense, expenseIndex) => (
                                                                                    <div key={expenseIndex} className="flex items-center justify-between bg-purple-50/80 rounded p-3 border border-purple-100/50 group hover:bg-purple-100/50 transition-colors duration-200">
                                                                                        <div className="flex items-center space-x-3">
                                                                                            <Activity className="w-4 h-4 text-purple-500" />
                                                                                            <span className="text-sm text-gray-700">
                                                                                                {formatDate(expense.expensedAt)}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <span className="font-semibold text-purple-700">
                                                                                                {formatCurrency(expense.amount)}
                                                                                            </span>
                                                                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                                                <button
                                                                                                    onClick={() => openEditRangeExpenseModal(record, rangeIndex, expenseIndex)}
                                                                                                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all duration-200"
                                                                                                    title="Edit Expense"
                                                                                                >
                                                                                                    <Edit3 className="w-3 h-3" />
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={() => openDeleteRangeExpenseModal(record, rangeIndex, expenseIndex)}
                                                                                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-all duration-200"
                                                                                                    title="Delete Expense"
                                                                                                >
                                                                                                    <Trash2 className="w-3 h-3" />
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Regular Expenses */}
                                                    {record.regularExpenses && record.regularExpenses.items && record.regularExpenses.items.length > 0 && (
                                                        <div className="flex items-start space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-orange-100/50 shadow-sm hover:shadow-md transition-all duration-200">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                                <CreditCard className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-center mb-4">
                                                                    <p className="text-sm font-semibold text-orange-800">Regular Expenses</p>
                                                                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                                                        {formatCurrency(record.regularExpenses.expense || 0)}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {record.regularExpenses.items.map((expense, index) => (
                                                                        <div key={index} className="flex items-center justify-between bg-orange-50/80 rounded p-3 border border-orange-100/50 group hover:bg-orange-100/50 transition-colors duration-200">
                                                                            <div className="flex items-center space-x-3">
                                                                                <Activity className="w-4 h-4 text-orange-500" />
                                                                                <span className="text-sm text-gray-700">
                                                                                    {formatDate(expense.expensedAt)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <span className="font-semibold text-orange-700">
                                                                                    {formatCurrency(expense.amount)}
                                                                                </span>
                                                                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                                    <button
                                                                                        onClick={() => openEditRegularExpenseModal(record, index)}
                                                                                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all duration-200"
                                                                                        title="Edit Expense"
                                                                                    >
                                                                                        <Edit3 className="w-3 h-3" />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => openDeleteRegularExpenseModal(record, index)}
                                                                                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-all duration-200"
                                                                                        title="Delete Expense"
                                                                                    >
                                                                                        <Trash2 className="w-3 h-3" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Timestamps */}
                                                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-blue-200/50 text-sm text-gray-500 bg-white/50 rounded-lg px-4 py-3 backdrop-blur-sm">
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
                    {showEditModal && (
                        <ModalBackdrop show={showEditModal} onClose={() => { setShowEditModal(false); resetModalState(); }}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Edit3 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Edit {expenseType === 'range' ? 'Range' : 'Regular'} Expense
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => { setShowEditModal(false); resetModalState(); }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount (LKR)
                                        </label>
                                        <input
                                            type="number"
                                            value={editData.amount}
                                            onChange={handleAmountChange}
                                            className="w-full outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            placeholder="Enter amount"
                                            min="0"
                                            step="0.01"
                                            required
                                            autoComplete="off"
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expense Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={editData.expensedAt}
                                            onChange={handleDateChange}
                                            className="w-full outline-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            required
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setShowEditModal(false); resetModalState(); }}
                                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleEditSubmit}
                                            disabled={isLoading || !editData.amount || !editData.expensedAt}
                                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ModalBackdrop>
                    )}

                    {/* Delete Confirmation Modal */}
                    <ModalBackdrop show={showDeleteModal} onClose={() => { setShowDeleteModal(false); resetModalState(); }}>
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Delete {expenseType === 'range' ? 'Range' : 'Regular'} Expense</h2>
                                    <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                                </div>
                            </div>

                            {selectedExpense && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <p className="text-red-800">
                                        Are you sure you want to delete this expense of <strong>{formatCurrency(selectedExpense.amount)}</strong>
                                        from <strong>{formatDate(selectedExpense.expensedAt)}</strong>?
                                        This will permanently remove the expense and update the totals.
                                    </p>
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowDeleteModal(false); resetModalState(); }}
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
                                    <span>{isLoading ? 'Deleting...' : 'Delete Expense'}</span>
                                </button>
                            </div>
                        </div>
                    </ModalBackdrop>
                </>
            )}
        </>
    );
};

export default EpfWFullCard;