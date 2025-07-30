import React, { useEffect, useState } from 'react';
import { ChevronRight, Home, X, MoreHorizontal } from 'lucide-react';

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

    // Icons for different page types
    const getPageIcon = (path) => {
        if (path === 'dashboard') return Home;
        return null;
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
                                                    className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                                                    title="Show all breadcrumbs"
                                                >
                                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={`${crumb.path}-${crumb.timestamp}`} className="flex items-center space-x-1">
                                            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}

                                            <div className={`group flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 ${isLast
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'hover:bg-gray-100 text-gray-600'
                                                }`}>
                                                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}

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
                                                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-gray-200 transition-all duration-200"
                                                        title="Remove from breadcrumb"
                                                    >
                                                        <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
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
                                    className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-200"
                                >
                                    {showAllBreadcrumbs ? 'Collapse' : 'Show All'}
                                </button>
                            )}

                            {breadcrumbs.length > 1 && (
                                <button
                                    onClick={clearBreadcrumbs}
                                    className="text-xs px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-200"
                                    title="Clear all breadcrumbs"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick access tabs for recent pages */}
                    {breadcrumbs.length > 1 && (
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                            <span className="text-xs text-gray-500 whitespace-nowrap">Quick Access:</span>
                            <div className="flex space-x-1">
                                {breadcrumbs.slice(-5).map((crumb, index) => {
                                    const isActive = crumb.path === currentPath;
                                    return (
                                        <button
                                            key={`quick-${crumb.path}-${crumb.timestamp}`}
                                            onClick={() => !isActive && handleBreadcrumbClick(crumb.path, breadcrumbs.findIndex(b => b.path === crumb.path))}
                                            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all duration-200 ${isActive
                                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                }`}
                                            disabled={isActive}
                                        >
                                            {crumb.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Page Title and Subtitle */}
            <div className="border-l-4 border-blue-500 pl-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
                {subtitle && (
                    <p className="text-gray-600 text-sm leading-relaxed">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

export default TabHeader;   