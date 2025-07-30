import React, { useEffect, useState } from 'react';
import {
    ChevronRight,
    Home,
    X,
    MoreHorizontal,
    Users,
    UserPlus,
    Edit,
    User,
    Building2,
    Plus,
    Edit3,
    FileText,
    Calculator,
    Shield,
    Settings,
    BarChart3,
    Briefcase
} from 'lucide-react';

const TabHeader = ({ title, subtitle, currentPath }) => {
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [showAllBreadcrumbs, setShowAllBreadcrumbs] = useState(false);

    // Page mapping for better breadcrumb labels
    const pageLabels = {
        'dashboard': 'Dashboard',
        'employees': 'Employees',
        'employees/add': 'Add Employee',
        'employees/edit': 'Edit Employee',
        'employees/id': 'Employee Details',
        'departments': 'Departments',
        'departments/add': 'Add Department',
        'departments/edit': 'Edit Department',
        'departments/id': 'Department Details',
        'epf': 'EPF Records',
        'epf/add': 'Add EPF Entry',
        'admins': 'Admins',
        'admins/add': 'Add Admin',
        'settings/epf': 'EPF Settings',
        'reports': 'Reports'
    };

    // Get the current page icon based on path
    const getCurrentPageIcon = () => {
        const Icon = getPageIcon(currentPath);
        return <Icon className="w-7 h-7 text-white drop-shadow-sm" />;
    };
    // Icons for different page types
    const getPageIcon = (path) => {
        const iconMap = {
            'dashboard': Home,
            'employees': Users,
            'employees/add': UserPlus,
            'employees/edit': Edit,
            'employees/id': User,
            'departments': Building2,
            'departments/add': Plus,
            'departments/edit': Edit3,
            'departments/id': Building2,
            'epf': Calculator,
            'epf/add': Plus,
            'admins': Shield,
            'admins/add': UserPlus,
            'settings/epf': Settings,
            'reports': BarChart3
        };

        return iconMap[path] || Briefcase;
    };

    // Function to get page label
    const getPageLabel = (path) => {
        return pageLabels[path] || path.split('/').pop();
    };

    // Function to handle breadcrumb navigation
    const handleBreadcrumbClick = (targetPath, index) => {
        if (targetPath && window.setCurrentPage) {
            window.setCurrentPage(targetPath);
            const currentHistory = JSON.parse(sessionStorage.getItem('breadcrumbHistory') || '[]');
            const newHistory = currentHistory.slice(0, index + 1);
            sessionStorage.setItem('breadcrumbHistory', JSON.stringify(newHistory));
        }
    };

    // Function to remove specific breadcrumb
    const removeBreadcrumb = (indexToRemove, e) => {
        e.stopPropagation();
        const currentHistory = JSON.parse(sessionStorage.getItem('breadcrumbHistory') || '[]');
        const newHistory = currentHistory.filter((_, index) => index !== indexToRemove);
        sessionStorage.setItem('breadcrumbHistory', JSON.stringify(newHistory));
        setBreadcrumbs(newHistory);
    };

    useEffect(() => {
        if (!currentPath) return;

        const existingHistory = JSON.parse(sessionStorage.getItem('breadcrumbHistory') || '[]');
        const lastItem = existingHistory[existingHistory.length - 1];

        if (lastItem && lastItem.path === currentPath) {
            setBreadcrumbs(existingHistory);
            return;
        }

        const newBreadcrumb = {
            path: currentPath,
            label: getPageLabel(currentPath),
            timestamp: Date.now()
        };

        const updatedHistory = [...existingHistory, newBreadcrumb].slice(-8); // Limit to 8 items
        sessionStorage.setItem('breadcrumbHistory', JSON.stringify(updatedHistory));
        setBreadcrumbs(updatedHistory);
    }, [currentPath]);

    const clearBreadcrumbs = () => {
        sessionStorage.removeItem('breadcrumbHistory');
        setBreadcrumbs([]);
    };

    // Determine which breadcrumbs to show
    const getVisibleBreadcrumbs = () => {
        if (showAllBreadcrumbs || breadcrumbs.length <= 4) {
            return breadcrumbs;
        }

        // Show first, collapsed indicator, and last 2
        return [
            breadcrumbs[0],
            { isCollapsed: true },
            ...breadcrumbs.slice(-2)
        ];
    };

    const visibleBreadcrumbs = getVisibleBreadcrumbs();

    return (
        <div className="mb-6">
            {breadcrumbs.length > 0 && (
                <div className="mb-4">
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <nav className="flex items-center space-x-1 min-w-0 flex-1" aria-label="Breadcrumb">
                            <div className="flex items-center space-x-1 overflow-hidden">
                                {visibleBreadcrumbs.map((crumb, index) => {
                                    const isLast = index === visibleBreadcrumbs.length - 1;
                                    const Icon = getPageIcon(crumb.path);

                                    if (crumb.isCollapsed) {
                                        return (
                                            <div key="collapsed" className="flex items-center space-x-1">
                                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <button
                                                    onClick={() => setShowAllBreadcrumbs(!showAllBreadcrumbs)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                                                    title="Show all breadcrumbs"
                                                >
                                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={`${crumb.path}-${crumb.timestamp}`} className="flex items-center space-x-1">
                                            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}

                                            <div className={`group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isLast
                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                                                : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200 hover:shadow-sm'
                                                }`}>
                                                <div className={`p-1 rounded-md ${isLast
                                                    ? 'bg-blue-100'
                                                    : 'bg-gray-100 group-hover:bg-gray-200'
                                                    }`}>
                                                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isLast
                                                        ? 'text-blue-600'
                                                        : 'text-gray-500 group-hover:text-gray-700'
                                                        }`} />
                                                </div>

                                                <button
                                                    onClick={() => !isLast && handleBreadcrumbClick(crumb.path, breadcrumbs.findIndex(b => b.path === crumb.path))}
                                                    className={`text-sm font-medium truncate max-w-32 transition-colors duration-200 ${isLast
                                                        ? 'cursor-default'
                                                        : 'hover:text-blue-600 cursor-pointer'
                                                        }`}
                                                    disabled={isLast}
                                                    title={crumb.label}
                                                >
                                                    {crumb.label}
                                                </button>

                                                {!isLast && breadcrumbs.length > 2 && (
                                                    <button
                                                        onClick={(e) => removeBreadcrumb(breadcrumbs.findIndex(b => b.path === crumb.path), e)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-100 transition-all duration-200 ml-1"
                                                        title="Remove from breadcrumb"
                                                    >
                                                        <X className="w-3 h-3 text-red-400 hover:text-red-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                            {breadcrumbs.length > 4 && (
                                <button
                                    onClick={() => setShowAllBreadcrumbs(!showAllBreadcrumbs)}
                                    className="text-xs px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 font-medium"
                                >
                                    {showAllBreadcrumbs ? 'Collapse' : 'Show All'}
                                </button>
                            )}

                            {breadcrumbs.length > 1 && (
                                <button
                                    onClick={clearBreadcrumbs}
                                    className="text-xs px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 font-medium"
                                    title="Clear all breadcrumbs"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick access tabs for recent pages */}
                    {breadcrumbs.length > 1 && (
                        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                            <span className="text-xs text-gray-500 whitespace-nowrap font-medium">Quick Access:</span>
                            <div className="flex space-x-2">
                                {breadcrumbs.slice(-5).map((crumb, index) => {
                                    const isActive = crumb.path === currentPath;
                                    const Icon = getPageIcon(crumb.path);
                                    return (
                                        <button
                                            key={`quick-${crumb.path}-${crumb.timestamp}`}
                                            onClick={() => !isActive && handleBreadcrumbClick(crumb.path, breadcrumbs.findIndex(b => b.path === crumb.path))}
                                            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-all duration-200 ${isActive
                                                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-300 shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border border-gray-200 hover:shadow-sm'
                                                }`}
                                            disabled={isActive}
                                        >
                                            <Icon className={`w-3 h-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                            <span className="font-medium">{crumb.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Page Title and Subtitle */}
            <div className="flex items-start space-x-4 border-l-4 border-l-blue-600 pl-6 py-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                    {getCurrentPageIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1 leading-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TabHeader;