import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, ChevronDown, UserCircle, LogOut } from 'lucide-react';

const Topbar = ({ setSidebarOpen, currentPage }) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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
        // Add your profile navigation logic here
    };

    const handleLogoutClick = () => {
        console.log('Logout clicked');
        setIsProfileDropdownOpen(false);
        // Add your logout logic here
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h2 className="ml-4 lg:ml-0 text-lg font-semibold text-gray-900">
                        {getPageTitle(currentPage)}
                    </h2>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Enhanced Search Bar */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search employees, departments..."
                            className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 
                                     focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                     transition-all duration-200 text-sm placeholder-gray-500"
                        />
                    </div>

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
    );
};

export default Topbar;