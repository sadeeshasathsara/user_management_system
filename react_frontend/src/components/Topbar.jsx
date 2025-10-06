import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, ChevronDown, UserCircle, LogOut, Filter, X, Clock, Users, Building2, FileText, Settings, BarChart3, AlertCircle } from 'lucide-react';
import { logoutApi } from '../apis/logout.api';
import { getEmployeesApi } from '../apis/employee.api';
import { fetchDepartmentsApi } from '../apis/department.api';
import { getEmpEpf } from '../apis/epf.api';
import { useUserStore } from '../tools/user.zustand';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [recentSearches, setRecentSearches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [epfRecords, setEpfRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchInputRef = useRef(null);
    const debounceRef = useRef(null);

    // System navigation data
    const systemNavigation = [
        { title: 'Dashboard', url: '/dashboard', description: 'Main dashboard with overview and key metrics', keywords: ['dashboard', 'home', 'overview', 'main', 'metrics', 'summary'] },
        { title: 'Overview', url: '/dashboard#overview', description: 'Quick summary of system statistics and insights', keywords: ['overview', 'summary', 'stats', 'insights', 'quick view'] },
        { title: 'Total Employee Stats', url: '/dashboard#stats', description: 'Employee count, EPF totals, salary metrics, and department statistics', keywords: ['stats', 'statistics', 'total', 'employee', 'epf', 'salary', 'departments', 'admin', 'users', 'metrics', 'count'] },
        { title: 'Team Distribution', url: '/dashboard#teamdestribution', description: 'Visual charts showing employee distribution across departments', keywords: ['team', 'distribution', 'chart', 'graph', 'visual', 'departments', 'breakdown'] },
        { title: 'EPF Contribution', url: '/dashboard#epfcontribution', description: 'Monthly and yearly EPF contribution trends and analytics', keywords: ['epf', 'contribution', 'fund', 'provident', 'trends', 'analytics', 'monthly', 'yearly'] },
        { title: 'Employees', url: '/employees', description: 'Complete employee directory with profiles and information', keywords: ['employees', 'staff', 'workers', 'personnel', 'team members', 'directory', 'profiles'] },
        { title: 'New Employee', url: '/employees/add', description: 'Add new employee with personal details and job information', keywords: ['add', 'new', 'create', 'employee', 'register', 'hire', 'onboard', 'recruit'] },
        { title: 'Departments', url: '/departments', description: 'Manage organizational departments and their structure', keywords: ['departments', 'divisions', 'sections', 'units', 'organization', 'structure', 'teams'] },
        { title: 'New Department', url: '/departments/add', description: 'Create new department with description and settings', keywords: ['add', 'new', 'create', 'department', 'division', 'section', 'unit'] },
        { title: 'EPF Entries', url: '/epf', description: 'View and manage all EPF contribution records and history', keywords: ['epf', 'provident', 'fund', 'entries', 'records', 'contributions', 'history', 'payments'] },
        { title: 'New EPF Entry', url: '/epf/add', description: 'Record new EPF contribution for an employee', keywords: ['add', 'new', 'create', 'epf', 'entry', 'contribution', 'record', 'payment'] },
        { title: 'Admins', url: '/admins', description: 'System administrators and their access permissions', keywords: ['admins', 'administrators', 'users', 'management', 'permissions', 'access', 'system'] },
        { title: 'New Admin', url: '/admins/add', description: 'Add new system administrator with access rights', keywords: ['add', 'new', 'create', 'admin', 'administrator', 'user', 'access', 'permissions'] },
        { title: 'EPF Configurations', url: '/settings/epf', description: 'Configure EPF rates, calculations, and system settings', keywords: ['settings', 'configuration', 'epf', 'setup', 'preferences', 'rates', 'calculations'] },
    ];

    const filters = [
        { id: 'all', label: 'All', icon: Search, color: 'text-indigo-400' },
        { id: 'navigation', label: 'Navigation', icon: BarChart3, color: 'text-purple-400' },
        { id: 'employees', label: 'Employees', icon: Users, color: 'text-blue-400' },
        { id: 'departments', label: 'Departments', icon: Building2, color: 'text-green-400' },
        { id: 'epf', label: 'EPF Records', icon: FileText, color: 'text-orange-400' },
    ];

    // API call to fetch employees
    const fetchEmployees = async (query) => {
        if (!query || query.trim().length < 2) {
            setEmployees([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getEmployeesApi({ search: query.trim() });
            setEmployees(response.data || response || []);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError('Failed to fetch employees');
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    // API call to fetch departments
    const fetchDepartments = async (query) => {
        if (!query || query.trim().length < 2) {
            setDepartments([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetchDepartmentsApi({ search: query.trim() });
            setDepartments(response.data || response || []);
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('Failed to fetch departments');
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    // API call to fetch EPF records
    const fetchEpfRecords = async (query) => {
        if (!query || query.trim().length < 2) {
            setEpfRecords([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getEmpEpf({ search: query.trim() });
            // Handle the response data structure based on your API response format
            const epfData = response.data || response || [];
            setEpfRecords(Array.isArray(epfData) ? epfData : []);
        } catch (err) {
            console.error('Error fetching EPF records:', err);
            setError('Failed to fetch EPF records');
            setEpfRecords([]);
        } finally {
            setLoading(false);
        }
    };

    // Load recent searches from localStorage on component mount
    useEffect(() => {
        try {
            const savedSearches = localStorage.getItem('recentSearches');
            if (savedSearches) {
                const parsedSearches = JSON.parse(savedSearches);
                if (Array.isArray(parsedSearches)) {
                    setRecentSearches(parsedSearches);
                }
            }
        } catch (error) {
            console.error('Error loading recent searches from localStorage:', error);
            setRecentSearches([]);
        }
    }, []);

    // Save recent searches to localStorage whenever they change
    const saveRecentSearches = (searches) => {
        setRecentSearches(searches);
        try {
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        } catch (error) {
            console.error('Error saving recent searches to localStorage:', error);
        }
    };

    // Debounced search effect
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (searchQuery) {
            debounceRef.current = setTimeout(() => {
                if (selectedFilter === 'all') {
                    // Fetch employees, departments, and EPF records for 'all' filter
                    fetchEmployees(searchQuery);
                    fetchDepartments(searchQuery);
                    fetchEpfRecords(searchQuery);
                } else if (selectedFilter === 'employees') {
                    fetchEmployees(searchQuery);
                    setDepartments([]);
                    setEpfRecords([]);
                } else if (selectedFilter === 'departments') {
                    fetchDepartments(searchQuery);
                    setEmployees([]);
                    setEpfRecords([]);
                } else if (selectedFilter === 'epf') {
                    fetchEpfRecords(searchQuery);
                    setEmployees([]);
                    setDepartments([]);
                } else {
                    setEmployees([]);
                    setDepartments([]);
                    setEpfRecords([]);
                    setLoading(false);
                }
            }, 300); // 300ms debounce
        } else {
            setEmployees([]);
            setDepartments([]);
            setEpfRecords([]);
            setLoading(false);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchQuery, selectedFilter]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filterResults = (items, query, type) => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();

        switch (type) {
            case 'navigation':
                return systemNavigation.filter(item =>
                    item.title.toLowerCase().includes(lowerQuery) ||
                    item.description.toLowerCase().includes(lowerQuery) ||
                    item.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
                );
            default:
                return [];
        }
    };

    const getFilteredResults = () => {
        if (!searchQuery) return [];

        let results = [];

        if (selectedFilter === 'all') {
            // Navigation results
            const navigationResults = filterResults([], searchQuery, 'navigation')
                .map(item => ({ ...item, type: 'navigation' }));

            // Employee results (from API)
            const employeeResults = employees.map(emp => ({
                ...emp,
                type: 'employees',
                name: emp.name,
                epfNumber: emp.epfNumber,
                department: emp.department?.name || emp.department,
                email: emp.email
            }));

            // Department results (from API)
            const departmentResults = departments.map(dept => ({
                ...dept,
                type: 'departments',
                name: dept.name,
                description: dept.description
            }));

            // EPF results (from API)
            const epfResults = epfRecords.map(record => ({
                ...record,
                type: 'epf',
                // Handle different possible data structures from your API
                employeeName: record.user?.name || record.employeeName || 'Unknown Employee',
                totalExpense: record.expense || record.totalExpense || 0,
                year: new Date(record.year).getFullYear() || 'Unknown Year',
                rangeExpensesCount: record.rangeExpenses?.length || 0,
                regularExpensesCount: record.regularExpenses?.items?.length || 0
            }));

            results = [...navigationResults, ...employeeResults, ...departmentResults, ...epfResults];
        } else if (selectedFilter === 'employees') {
            results = employees.map(emp => ({
                ...emp,
                type: 'employees',
                name: emp.name,
                epfNumber: emp.epfNumber,
                department: emp.department?.name || emp.department,
                email: emp.email
            }));
        } else if (selectedFilter === 'departments') {
            results = departments.map(dept => ({
                ...dept,
                type: 'departments',
                name: dept.name,
                description: dept.description
            }));
        } else if (selectedFilter === 'epf') {
            results = epfRecords.map(record => ({
                ...record,
                type: 'epf',
                employeeName: record.user?.name || record.employeeName || 'Unknown Employee',
                totalExpense: record.expense || record.totalExpense || 0,
                year: new Date(record.year).getFullYear() || 'Unknown Year',
                rangeExpensesCount: record.rangeExpenses?.length || 0,
                regularExpensesCount: record.regularExpenses?.items?.length || 0
            }));
        } else {
            results = filterResults([], searchQuery, selectedFilter)
                .map(item => ({ ...item, type: selectedFilter }));
        }

        return results;
    };

    const handleResultClick = (result) => {
        if (result.type === 'navigation' && result.url) {
            window.location.href = result.url;
        } else if (result.type === 'employees') {
            // Navigate to employee page with emp parameter
            window.location.href = `/employees?emp=${result._id || result.id}`;
        } else if (result.type === 'departments') {
            // Navigate to departments page with dept parameter
            window.location.href = `/departments?dept=${result._id || result.id}`;
        } else if (result.type === 'epf') {
            // Navigate to EPF page with id parameter
            window.location.href = `/epf?id=${result._id || result.id}`;
        }

        // Add to recent searches
        const searchTerm = result.title || result.name || result.employeeName;
        if (searchTerm && !recentSearches.includes(searchTerm)) {
            const updatedSearches = [searchTerm, ...recentSearches.slice(0, 4)];
            saveRecentSearches(updatedSearches);
        }

        onClose();
    };

    const getResultIcon = (type) => {
        switch (type) {
            case 'navigation': return BarChart3;
            case 'employees': return Users;
            case 'departments': return Building2;
            case 'epf': return FileText;
            default: return Search;
        }
    };

    const getResultTagColor = (type) => {
        switch (type) {
            case 'navigation': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'employees': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'departments': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'epf': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            default: return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
        }
    };

    const getResultTagLabel = (type) => {
        switch (type) {
            case 'navigation': return 'Navigation';
            case 'employees': return 'Employee';
            case 'departments': return 'Department';
            case 'epf': return 'EPF Record';
            default: return type;
        }
    };

    const handleRecentSearchClick = (search) => {
        setSearchQuery(search);
        // Auto-search when clicking recent search based on current filter
        if (selectedFilter === 'all') {
            fetchEmployees(search);
            fetchDepartments(search);
            fetchEpfRecords(search);
        } else if (selectedFilter === 'employees') {
            fetchEmployees(search);
        } else if (selectedFilter === 'departments') {
            fetchDepartments(search);
        } else if (selectedFilter === 'epf') {
            fetchEpfRecords(search);
        }
    };

    const { user, setUser } = useUserStore();

    if (!isOpen) return null;

    const results = getFilteredResults();

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl mx-4">
                {/* Glassmorphism Search Container */}
                <div className="backdrop-blur-xl bg-gray-900/80 border border-gray-700/50 rounded-2xl shadow-2xl">
                    {/* Search Header */}
                    <div className="p-6 border-b border-gray-700/30">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1">
                                <Search className="absolute z-50 left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search employees, departments, Medical records by name, EPF number, year..."
                                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
                                />
                                {loading && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center space-x-2 mt-4">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <div className="flex space-x-1">
                                {filters.map((filter) => {
                                    const IconComponent = filter.icon;
                                    return (
                                        <button
                                            key={filter.id}
                                            onClick={() => setSelectedFilter(filter.id)}
                                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${selectedFilter === filter.id
                                                ? 'bg-gray-700/60 text-white border border-gray-600/50'
                                                : `${filter.color} hover:text-white hover:bg-gray-700/40`
                                                }`}
                                        >
                                            <IconComponent className="w-3.5 h-3.5" />
                                            <span>{filter.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {searchQuery ? (
                            error ? (
                                <div className="p-8 text-center">
                                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                    <p className="text-red-300">{error}</p>
                                    <p className="text-gray-400 text-sm mt-1">Please try again</p>
                                </div>
                            ) : loading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                                    <p className="text-gray-300">Searching...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="p-2">
                                    {results.map((result, index) => {
                                        const IconComponent = getResultIcon(result.type);
                                        return (
                                            <button
                                                key={`${result.type}-${result._id || result.id || index}`}
                                                onClick={() => handleResultClick(result)}
                                                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200 text-left group"
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center group-hover:bg-gray-600/60">
                                                    <IconComponent className="w-4 h-4 text-gray-300" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">
                                                        {result.title || result.name || result.employeeName}
                                                    </p>
                                                    <p className="text-gray-400 text-sm truncate">
                                                        {result.type === 'navigation' && result.description}
                                                        {result.type === 'employees' && (
                                                            <>
                                                                {result.department} • {result.epfNumber}
                                                                {result.email && ` • ${result.email}`}
                                                                {result.contactNumber && ` • ${result.contactNumber}`}
                                                            </>
                                                        )}
                                                        {result.type === 'departments' && result.description}
                                                        {result.type === 'epf' && (
                                                            <>
                                                                Total: LKR {result.totalExpense?.toLocaleString() || '0'} • {result.year}
                                                                {result.rangeExpensesCount > 0 && ` • ${result.rangeExpensesCount} range expense${result.rangeExpensesCount > 1 ? 's' : ''}`}
                                                                {result.regularExpensesCount > 0 && ` • ${result.regularExpensesCount} regular expense${result.regularExpensesCount > 1 ? 's' : ''}`}
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${getResultTagColor(result.type)}`}>
                                                        {getResultTagLabel(result.type)}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                    <p className="text-gray-300">No results found for "{searchQuery}"</p>
                                    <p className="text-gray-400 text-sm mt-1">Try different keywords or check spelling</p>
                                </div>
                            )
                        ) : (
                            <div className="p-4">
                                {recentSearches.length > 0 ? (
                                    <>
                                        <h3 className="text-gray-300 font-medium mb-3 flex items-center space-x-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Recent Searches</span>
                                        </h3>
                                        {recentSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleRecentSearchClick(search)}
                                                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 text-left"
                                            >
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-300">{search}</span>
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                        <p className="text-gray-300">No recent searches</p>
                                        <p className="text-gray-400 text-sm">Start searching to see your history</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700/30">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Press Esc to close</span>
                            <span>Use ↑↓ to navigate • Enter to select</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Topbar = ({ setSidebarOpen, currentPage }) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileButtonRef = useRef(null);

    const { user } = useUserStore();

    const getPageTitle = (path) => {
        const titles = {
            'dashboard': 'Dashboard Overview',
            'employees': 'Employee Management',
            'employees/add': 'Add New Employee',
            'departments': 'Department Management',
            'departments/add': 'Add New Department',
            'epf': 'EPF Records',
            'epf/add': 'Add EPF Entry',
            'admins': 'Admin Management',
            'admins/add': 'Add New Admin',
            'settings/epf': 'EPF Configuration',
            'reports': 'Reports & Analytics',
            'profile': 'Administrator Profile'
        };
        return titles[path] || 'Dashboard';
    };

    // Keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'f') {
                event.preventDefault();
                setIsSearchModalOpen(true);
            }
            if (event.key === 'Escape') {
                setIsSearchModalOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                profileButtonRef.current &&
                !profileButtonRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const navigate = useNavigate()

    const handleProfileClick = () => {
        navigate('/profile')
        setIsProfileDropdownOpen(false);
    };

    const handleLogoutClick = async () => {
        setIsProfileDropdownOpen(false);
        await logoutApi();
    };

    const handleSearchClick = () => {
        setIsSearchModalOpen(true);
    };

    return (
        <>
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="flex items-center justify-between h-16 px-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="ml-4 flex items-center justify-center lg:ml-0 text-sm font-bold text-blue-800 border border-blue-800 text-center p-2 rounded-md bg-blue-100">
                            {getPageTitle(currentPage)}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Enhanced Search Bar */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="(Ctrl + F) Search employees, departments, EPF records..."
                                onClick={handleSearchClick}
                                readOnly
                                className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 
                                         hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                         transition-all duration-200 text-sm placeholder-gray-500 cursor-pointer"
                            />
                        </div>

                        {/* Mobile Search Button */}
                        <button
                            onClick={handleSearchClick}
                            className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Admin Profile with Dropdown */}
                        <div className="relative">
                            <button
                                ref={profileButtonRef}
                                onClick={toggleProfileDropdown}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || `Admin User`}</span>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                                >
                                    {/* Profile Header */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user?.name || `Admin User`}</p>
                                        <p className="text-xs text-gray-500">{user?.email || `admin@company.com`}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <UserCircle className="w-4 h-4 mr-3 text-gray-400" />
                                        Profile
                                    </button>

                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <LogOut className="w-4 h-4 mr-3 text-red-500" />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
            />
        </>
    );
};

export default Topbar;