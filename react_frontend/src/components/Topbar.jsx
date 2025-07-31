import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, ChevronDown, UserCircle, LogOut, Filter, X, Clock, Users, Building2, FileText, Settings, BarChart3 } from 'lucide-react';
import { logoutApi } from '../apis/logout.api';

const SearchModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [recentSearches, setRecentSearches] = useState(['John Doe', 'HR Department', 'EPF Entry 2024']);
    const searchInputRef = useRef(null);

    // Mock data - replace with actual API calls
    const systemNavigation = [
        { title: 'Dashboard', url: '/dashboard', description: 'Main dashboard with overview and key metrics', keywords: ['dashboard', 'home', 'overview', 'main', 'metrics', 'summary'] },
        { title: 'Overview', url: '/dashboard#overview', description: 'Quick summary of system statistics and insights', keywords: ['overview', 'summary', 'stats', 'insights', 'quick view'] },
        { title: 'Total Employee Stats', url: '/dashboard#stats', description: 'Employee count, EPF totals, salary metrics, and department statistics', keywords: ['stats', 'statistics', 'total', 'employee', 'epf', 'salary', 'departments', 'admin', 'users', 'metrics', 'count'] },
        { title: 'Team Distribution', url: '/dashboard#teamdestribution', description: 'Visual charts showing employee distribution across departments', keywords: ['team', 'distribution', 'chart', 'graph', 'visual', 'departments', 'breakdown'] },
        { title: 'EPF Contribution', url: '/dashboard#epfcontribution', description: 'Monthly and yearly EPF contribution trends and analytics', keywords: ['epf', 'contribution', 'fund', 'provident', 'trends', 'analytics', 'monthly', 'yearly'] },
        { title: 'New Employees', url: '/dashboard#newemployees', description: 'Recently joined employees and onboarding status', keywords: ['new', 'recent', 'latest', 'employees', 'joined', 'onboarding', 'recruits'] },
        { title: 'Recent EPF Entries', url: '/dashboard#recentepf', description: 'Latest EPF contributions and payment records', keywords: ['recent', 'epf', 'entries', 'latest', 'contributions', 'payments', 'records'] },
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

    const mockEmployees = [
        { id: '1', name: 'John Doe', epfNumber: 'EPF001', department: 'IT', email: 'john@company.com' },
        { id: '2', name: 'Jane Smith', epfNumber: 'EPF002', department: 'HR', email: 'jane@company.com' },
        { id: '3', name: 'Mike Johnson', epfNumber: 'EPF003', department: 'Finance', email: 'mike@company.com' },
    ];

    const mockDepartments = [
        { id: '1', name: 'Information Technology', description: 'IT Department handling software development' },
        { id: '2', name: 'Human Resources', description: 'HR Department managing employee relations' },
        { id: '3', name: 'Finance', description: 'Finance Department handling accounting' },
    ];

    const mockEpfRecords = [
        { id: '1', employeeName: 'John Doe', expense: 5000, year: '2024' },
        { id: '2', employeeName: 'Jane Smith', expense: 4500, year: '2024' },
        { id: '3', employeeName: 'Mike Johnson', expense: 5200, year: '2024' },
    ];

    const filters = [
        { id: 'all', label: 'All', icon: Search },
        { id: 'navigation', label: 'Navigation', icon: BarChart3 },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'epf', label: 'EPF Records', icon: FileText },
    ];

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
            case 'employees':
                return mockEmployees.filter(emp =>
                    emp.name.toLowerCase().includes(lowerQuery) ||
                    emp.epfNumber.toLowerCase().includes(lowerQuery) ||
                    emp.department.toLowerCase().includes(lowerQuery) ||
                    emp.email.toLowerCase().includes(lowerQuery)
                );
            case 'departments':
                return mockDepartments.filter(dept =>
                    dept.name.toLowerCase().includes(lowerQuery) ||
                    dept.description.toLowerCase().includes(lowerQuery)
                );
            case 'epf':
                return mockEpfRecords.filter(record =>
                    record.employeeName.toLowerCase().includes(lowerQuery) ||
                    record.year.includes(lowerQuery)
                );
            default:
                return [];
        }
    };

    const getFilteredResults = () => {
        if (!searchQuery) return [];

        if (selectedFilter === 'all') {
            return [
                ...filterResults([], searchQuery, 'navigation').map(item => ({ ...item, type: 'navigation' })),
                ...filterResults([], searchQuery, 'employees').map(item => ({ ...item, type: 'employees' })),
                ...filterResults([], searchQuery, 'departments').map(item => ({ ...item, type: 'departments' })),
                ...filterResults([], searchQuery, 'epf').map(item => ({ ...item, type: 'epf' })),
            ];
        }

        return filterResults([], searchQuery, selectedFilter).map(item => ({ ...item, type: selectedFilter }));
    };

    const handleResultClick = (result) => {
        if (result.type === 'navigation' && result.url) {
            window.location.href = result.url;
        }

        // Add to recent searches
        if (!recentSearches.includes(result.title || result.name)) {
            setRecentSearches(prev => [result.title || result.name, ...prev.slice(0, 4)]);
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

    if (!isOpen) return null;

    const results = getFilteredResults();

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Container - No background */}
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
                                    placeholder="Search employees, departments, EPF records, or navigate..."
                                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
                                />
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
                                                : 'text-gray-300 hover:text-white hover:bg-gray-700/40'
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
                            results.length > 0 ? (
                                <div className="p-2">
                                    {results.map((result, index) => {
                                        const IconComponent = getResultIcon(result.type);
                                        return (
                                            <button
                                                key={index}
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
                                                        {result.type === 'employees' && `${result.department} • ${result.epfNumber}`}
                                                        {result.type === 'departments' && result.description}
                                                        {result.type === 'epf' && `${result.expense} • ${result.year}`}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded-full capitalize">
                                                        {result.type}
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
                                <h3 className="text-gray-300 font-medium mb-3 flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Recent Searches</span>
                                </h3>
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSearchQuery(search)}
                                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 text-left"
                                    >
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-300">{search}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700/30">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Press Esc to close</span>
                            <span>Use ↑↓ to navigate</span>
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
            'reports': 'Reports & Analytics'
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

    const handleProfileClick = () => {
        console.log('Profile clicked');
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
                                placeholder="Search employees, departments... (Ctrl+F)"
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
                                <span className="hidden md:block text-sm font-medium text-gray-700">Admin User</span>
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
                                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                                        <p className="text-xs text-gray-500">admin@company.com</p>
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