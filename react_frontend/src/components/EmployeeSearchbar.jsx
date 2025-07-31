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
    placeholder = "Search employees by name, EPF, department, email..."
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        department: '',
        employmentType: '',
        maritalStatus: '',
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

    // Search and filter function
    const performSearch = () => {
        let results = [...employees];

        // Text search
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            results = results.filter(employee =>
                employee.name?.toLowerCase().includes(term) ||
                employee.epfNumber?.toLowerCase().includes(term) ||
                employee.email?.toLowerCase().includes(term) ||
                employee.contactNumber?.includes(term) ||
                employee.department?.name?.toLowerCase().includes(term) ||
                employee.nicNumber?.toLowerCase().includes(term) ||
                employee.address?.toLowerCase().includes(term)
            );
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

        // Salary range filter
        if (filters.salaryRange.min || filters.salaryRange.max) {
            results = results.filter(emp => {
                const salary = emp.basicSalary || 0;
                const min = filters.salaryRange.min ? parseFloat(filters.salaryRange.min) : 0;
                const max = filters.salaryRange.max ? parseFloat(filters.salaryRange.max) : Infinity;
                return salary >= min && salary <= max;
            });
        }

        // Sort results
        results.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'epfNumber':
                    aValue = a.epfNumber || '';
                    bValue = b.epfNumber || '';
                    break;
                case 'department':
                    aValue = a.department?.name?.toLowerCase() || '';
                    bValue = b.department?.name?.toLowerCase() || '';
                    break;
                case 'joinedDate':
                    aValue = new Date(a.joinedDate || 0);
                    bValue = new Date(b.joinedDate || 0);
                    break;
                case 'basicSalary':
                    aValue = a.basicSalary || 0;
                    bValue = b.basicSalary || 0;
                    break;
                default:
                    aValue = a[sortBy] || '';
                    bValue = b[sortBy] || '';
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
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
            salaryRange: { min: '', max: '' }
        });
        setSortBy('name');
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

    // Effect to trigger search when dependencies change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            performSearch();
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters, sortBy, sortOrder, employees]);

    const hasActiveFilters = searchTerm || filters.department || filters.employmentType ||
        filters.maritalStatus || filters.salaryRange.min || filters.salaryRange.max;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
            {/* Main Search Bar */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder={placeholder}
                />
                {searchTerm && (
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
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${showFilters
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
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="epfNumber">Sort by EPF</option>
                            <option value="department">Sort by Department</option>
                            <option value="joinedDate">Sort by Join Date</option>
                            <option value="basicSalary">Sort by Salary</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                        >
                            {sortOrder === 'asc' ?
                                <SortAsc className="w-4 h-4 text-gray-600" /> :
                                <SortDesc className="w-4 h-4 text-gray-600" />
                            }
                        </button>
                    </div>
                </div>

                {/* Results Count and Clear */}
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                        {searchResults.length} of {employees.length} employees
                    </span>
                    {hasActiveFilters && (
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
            {showFilters && (
                <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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