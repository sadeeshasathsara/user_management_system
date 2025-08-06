import React, { useState, useEffect } from 'react';
import {
    Search,
    X,
    Filter,
    SortAsc,
    SortDesc,
    User,
    Building2,
    Calendar,
    DollarSign,
    Heart,
    ChevronDown
} from 'lucide-react';

const EmployeeSearchBar = ({
    employees = [],
    onSearchResults,
    onClearSearch,
    placeholder = "Search employees by name, EPF, department, email...",
    disabled = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('all');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        department: '',
        employmentType: '',
        maritalStatus: '',
        gender: '',
        salaryRange: { min: '', max: '' }
    });
    const [searchResults, setSearchResults] = useState(employees);

    // Get unique values for filter dropdowns
    const getUniqueValues = (key) => {
        return [...new Set(employees.map(emp => {
            if (key === 'department') return emp.department?.name;
            return emp[key];
        }).filter(Boolean))];
    };

    // Enhanced search function
    const performSearch = () => {
        if (employees.length === 0) {
            setSearchResults([]);
            onSearchResults([]);
            return;
        }

        let results = [...employees];

        // Enhanced text search - search in multiple fields
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            results = results.filter(employee => {
                // Search in name
                const nameMatch = employee.name?.toLowerCase().includes(term);

                // Search in EPF number (exact and partial)
                const epfMatch = employee.epfNumber?.toLowerCase().includes(term);

                // Search in email
                const emailMatch = employee.email?.toLowerCase().includes(term);

                // Search in contact number (remove spaces and special characters for better matching)
                const contactMatch = employee.contactNumber?.replace(/[\s\-\+]/g, '').includes(term.replace(/[\s\-\+]/g, ''));

                // Search in department name
                const departmentMatch = employee.department?.name?.toLowerCase().includes(term);

                // Search in NIC number
                const nicMatch = employee.nicNumber?.toLowerCase().includes(term);

                // Search in address
                const addressMatch = employee.address?.toLowerCase().includes(term);

                return nameMatch || epfMatch || emailMatch || contactMatch || departmentMatch || nicMatch || addressMatch;
            });
        }

        // Apply filters
        if (filters.department) {
            results = results.filter(emp => emp.department?.name === filters.department);
        }

        if (filters.employmentType) {
            results = results.filter(emp => emp.employmentType === filters.employmentType);
        }

        if (filters.maritalStatus) {
            results = results.filter(emp => emp.maritalStatus === filters.maritalStatus);
        }

        if (filters.gender) {
            results = results.filter(emp => emp.gender === filters.gender);
        }

        // Salary range filter
        if (filters.salaryRange.min || filters.salaryRange.max) {
            results = results.filter(emp => {
                const salary = emp.basicSalary || 0;
                const min = filters.salaryRange.min ? parseFloat(filters.salaryRange.min) : 0;
                const max = filters.salaryRange.max ? parseFloat(filters.salaryRange.max) : Infinity;
                return salary >= min && salary <= max;
            });
        }

        // Enhanced sort functionality
        results.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'all':
                    // Sort by relevance when "all" is selected
                    // Primary: Name, Secondary: EPF Number, Tertiary: Department
                    const aName = a.name?.toLowerCase() || '';
                    const bName = b.name?.toLowerCase() || '';

                    if (aName !== bName) {
                        return sortOrder === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
                    }

                    // If names are same, sort by EPF number
                    const aEpf = parseInt(a.epfNumber?.replace(/\D/g, '') || '0') || 0;
                    const bEpf = parseInt(b.epfNumber?.replace(/\D/g, '') || '0') || 0;

                    if (aEpf !== bEpf) {
                        return sortOrder === 'asc' ? aEpf - bEpf : bEpf - aEpf;
                    }

                    // If EPF numbers are same, sort by department
                    const aDept = a.department?.name?.toLowerCase() || '';
                    const bDept = b.department?.name?.toLowerCase() || '';

                    return sortOrder === 'asc' ? aDept.localeCompare(bDept) : bDept.localeCompare(aDept);

                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'epfNumber':
                    // Extract numeric part for proper sorting (e.g., EPF001 -> 1, EPF010 -> 10)
                    aValue = parseInt(a.epfNumber?.replace(/\D/g, '') || '0') || 0;
                    bValue = parseInt(b.epfNumber?.replace(/\D/g, '') || '0') || 0;
                    break;
                case 'email':
                    aValue = a.email?.toLowerCase() || '';
                    bValue = b.email?.toLowerCase() || '';
                    break;
                case 'contactNumber':
                    aValue = a.contactNumber || '';
                    bValue = b.contactNumber || '';
                    break;
                case 'department':
                    aValue = a.department?.name?.toLowerCase() || '';
                    bValue = b.department?.name?.toLowerCase() || '';
                    break;
                case 'joinedDate':
                    aValue = new Date(a.joinedDate || 0);
                    bValue = new Date(b.joinedDate || 0);
                    break;
                case 'dateOfBirth':
                    aValue = new Date(a.dateOfBirth || 0);
                    bValue = new Date(b.dateOfBirth || 0);
                    break;
                case 'basicSalary':
                    aValue = a.basicSalary || 0;
                    bValue = b.basicSalary || 0;
                    break;
                case 'employmentType':
                    aValue = a.employmentType?.toLowerCase() || '';
                    bValue = b.employmentType?.toLowerCase() || '';
                    break;
                case 'maritalStatus':
                    aValue = a.maritalStatus?.toLowerCase() || '';
                    bValue = b.maritalStatus?.toLowerCase() || '';
                    break;
                case 'gender':
                    aValue = a.gender?.toLowerCase() || '';
                    bValue = b.gender?.toLowerCase() || '';
                    break;
                case 'nicNumber':
                    aValue = a.nicNumber || '';
                    bValue = b.nicNumber || '';
                    break;
                case 'address':
                    aValue = a.address?.toLowerCase() || '';
                    bValue = b.address?.toLowerCase() || '';
                    break;
                default:
                    aValue = a[sortBy] || '';
                    bValue = b[sortBy] || '';
            }

            // Handle different data types for comparison (skip for 'all' case as it's handled above)
            if (sortBy !== 'all') {
                if (aValue instanceof Date && bValue instanceof Date) {
                    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
                }

                // String comparison
                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            }
        });

        setSearchResults(results);
        onSearchResults(results);
    };

    // Clear search and filters
    const clearAll = () => {
        setSearchTerm('');
        setFilters({
            department: '',
            employmentType: '',
            maritalStatus: '',
            gender: '',
            salaryRange: { min: '', max: '' }
        });
        setSortBy('all');
        setSortOrder('asc');
        setSearchResults(employees);
        onClearSearch();
    };

    // Update filter
    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Update salary range filter
    const updateSalaryRange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            salaryRange: {
                ...prev.salaryRange,
                [type]: value
            }
        }));
    };

    // Effect to trigger search when dependencies change - BUT NOT when disabled
    useEffect(() => {
        if (disabled) {
            // When disabled (due to URL filtering), just update searchResults with whatever employees are passed
            setSearchResults(employees);
            return;
        }

        const timeoutId = setTimeout(() => {
            performSearch();
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters, sortBy, sortOrder, employees, disabled]);

    // Initialize search results when employees change
    useEffect(() => {
        if (disabled) {
            setSearchResults(employees);
            return;
        }

        if (employees.length > 0 && searchResults.length === 0 && !searchTerm && !hasActiveFilters) {
            setSearchResults(employees);
            onSearchResults(employees);
        }
    }, [employees, disabled]);

    const hasActiveFilters = searchTerm || filters.department || filters.employmentType ||
        filters.maritalStatus || filters.gender || filters.salaryRange.min || filters.salaryRange.max;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
            {/* Show disabled message when URL filtering is active */}
            {disabled && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                        Search is disabled while filtering by URL parameters. Clear the URL filter to enable search functionality.
                    </p>
                </div>
            )}

            {/* Main Search Bar */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={`h-5 w-5 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={disabled}
                    className={`block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm ${disabled
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                    placeholder={disabled ? "Search disabled while URL filtering is active" : placeholder}
                />
                {searchTerm && !disabled && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center space-x-3">
                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        disabled={disabled}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : showFilters
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Sort Controls */}
                    <div className="flex items-center space-x-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            disabled={disabled}
                            className={`text-sm border border-gray-300 rounded-lg px-3 py-2 ${disabled
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                        >
                            <option value="all">Sort by All (Default)</option>
                            <option value="name">Sort by Name</option>
                            <option value="epfNumber">Sort by EPF Number</option>
                            <option value="email">Sort by Email</option>
                            <option value="contactNumber">Sort by Contact Number</option>
                            <option value="department">Sort by Department</option>
                            <option value="joinedDate">Sort by Join Date</option>
                            <option value="dateOfBirth">Sort by Date of Birth</option>
                            <option value="basicSalary">Sort by Salary</option>
                            <option value="employmentType">Sort by Employment Type</option>
                            <option value="maritalStatus">Sort by Marital Status</option>
                            <option value="gender">Sort by Gender</option>
                            <option value="nicNumber">Sort by NIC Number</option>
                            <option value="address">Sort by Address</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            disabled={disabled}
                            className={`p-2 border border-gray-300 rounded-lg transition-colors duration-200 ${disabled
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-50'
                                }`}
                            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                        >
                            {sortOrder === 'asc' ?
                                <SortAsc className={`w-4 h-4 ${disabled ? 'text-gray-400' : 'text-gray-600'}`} /> :
                                <SortDesc className={`w-4 h-4 ${disabled ? 'text-gray-400' : 'text-gray-600'}`} />
                            }
                        </button>
                    </div>
                </div>

                {/* Results Count and Clear */}
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                        {searchResults.length} of {employees.length} employees
                    </span>
                    {hasActiveFilters && !disabled && (
                        <button
                            onClick={clearAll}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && !disabled && (
                <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Building2 className="w-4 h-4 inline mr-1" />
                                Department
                            </label>
                            <select
                                value={filters.department}
                                onChange={(e) => updateFilter('department', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Departments</option>
                                {getUniqueValues('department').map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Employment Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-1" />
                                Employment Type
                            </label>
                            <select
                                value={filters.employmentType}
                                onChange={(e) => updateFilter('employmentType', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Types</option>
                                {getUniqueValues('employmentType').map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Marital Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Heart className="w-4 h-4 inline mr-1" />
                                Marital Status
                            </label>
                            <select
                                value={filters.maritalStatus}
                                onChange={(e) => updateFilter('maritalStatus', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Status</option>
                                {getUniqueValues('maritalStatus').map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {/* Gender Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-1" />
                                Gender
                            </label>
                            <select
                                value={filters.gender}
                                onChange={(e) => updateFilter('gender', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Genders</option>
                                {getUniqueValues('gender').map(gender => (
                                    <option key={gender} value={gender}>{gender}</option>
                                ))}
                            </select>
                        </div>

                        {/* Salary Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Salary Range
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.salaryRange.min}
                                    onChange={(e) => updateSalaryRange('min', e.target.value)}
                                    className="w-1/2 text-sm border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.salaryRange.max}
                                    onChange={(e) => updateSalaryRange('max', e.target.value)}
                                    className="w-1/2 text-sm border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeSearchBar;       