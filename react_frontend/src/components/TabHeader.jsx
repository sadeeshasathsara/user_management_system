import React, { useEffect, useState } from 'react';

const TabHeader = ({ title, subtitle, currentPath }) => {
    const [breadcrumbs, setBreadcrumbs] = useState([]);

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

    // Function to get page label
    const getPageLabel = (path) => {
        return pageLabels[path] || path.split('/').pop();
    };

    // Function to handle breadcrumb navigation
    const handleBreadcrumbClick = (targetPath, index) => {
        if (targetPath && window.setCurrentPage) {
            // Update current page
            window.setCurrentPage(targetPath);

            // Update breadcrumb history - keep only up to clicked item
            const currentHistory = JSON.parse(sessionStorage.getItem('breadcrumbHistory') || '[]');
            const newHistory = currentHistory.slice(0, index + 1);
            sessionStorage.setItem('breadcrumbHistory', JSON.stringify(newHistory));
        }
    };

    useEffect(() => {
        if (!currentPath) return;

        // Get existing breadcrumb history from sessionStorage
        const existingHistory = JSON.parse(sessionStorage.getItem('breadcrumbHistory') || '[]');

        // Check if current path is already the last item in history
        const lastItem = existingHistory[existingHistory.length - 1];
        if (lastItem && lastItem.path === currentPath) {
            // Just update breadcrumbs display, don't add duplicate
            setBreadcrumbs(existingHistory);
            return;
        }

        // Create new breadcrumb item
        const newBreadcrumb = {
            path: currentPath,
            label: getPageLabel(currentPath),
            timestamp: Date.now()
        };

        // Add to history (limit to last 10 items to prevent overflow)
        const updatedHistory = [...existingHistory, newBreadcrumb].slice(-10);

        // Save to sessionStorage
        sessionStorage.setItem('breadcrumbHistory', JSON.stringify(updatedHistory));

        // Update breadcrumbs state
        setBreadcrumbs(updatedHistory);
    }, [currentPath]);

    // Function to clear breadcrumb history
    const clearBreadcrumbs = () => {
        sessionStorage.removeItem('breadcrumbHistory');
        setBreadcrumbs([]);
    };

    return (
        <div className="mb-6">
            {breadcrumbs.length > 0 && (
                <div className="flex items-center justify-between mb-2">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm text-gray-500">
                            {breadcrumbs.map((crumb, index) => (
                                <li key={`${crumb.path}-${crumb.timestamp}`} className="flex items-center">
                                    {index > 0 && <span className="mx-2 text-gray-300">/</span>}
                                    <button
                                        onClick={() => handleBreadcrumbClick(crumb.path, index)}
                                        className={`transition-colors duration-200 ${index === breadcrumbs.length - 1
                                                ? 'text-gray-900 font-medium cursor-default'
                                                : 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'
                                            }`}
                                        disabled={index === breadcrumbs.length - 1}
                                    >
                                        {crumb.label}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    {/* Clear breadcrumbs button */}
                    {breadcrumbs.length > 1 && (
                        <button
                            onClick={clearBreadcrumbs}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            title="Clear breadcrumb history"
                        >
                            Clear History
                        </button>
                    )}
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
            </div>
        </div>
    );
};

export default TabHeader;