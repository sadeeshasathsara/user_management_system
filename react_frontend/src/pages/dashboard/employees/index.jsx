import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import EmployeeWFullCard from '../../../components/EmployeeWFullCard';
import EmployeeSearchBar from '../../../components/EmployeeSearchbar';
import { getEmployeesApi } from '../../../apis/employee.api';

const EmployeesList = ({ currentPath }) => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isUrlFiltered, setIsUrlFiltered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSearchResults = (results) => {
        setFilteredEmployees(results);
    };

    const handleClearSearch = () => {
        setFilteredEmployees(employees);
        // Clear URL parameters when clearing search
        if (location.search) {
            navigate(location.pathname, { replace: true });
        }
    };

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getEmployeesApi({});
                setEmployees(data.data);
                setFilteredEmployees(data.data);
            } catch (err) {
                setError('Failed to load employees. Please try again.');
                console.error('Error loading employees:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadEmployees();
    }, []);

    // Handle URL parameter filtering
    useEffect(() => {
        if (employees.length === 0) return;

        const urlParams = new URLSearchParams(location.search);
        const empId = urlParams.get('emp');

        if (empId) {
            const filteredEmployee = employees.filter(employee => employee._id === empId);
            setFilteredEmployees(filteredEmployee);
            setIsUrlFiltered(true); // mark as URL-filtered
        } else {
            setFilteredEmployees(employees);
            setIsUrlFiltered(false); // no URL filter
        }
    }, [location.search, employees]);

    // Skeleton Loading Card Component
    const SkeletonCard = () => (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-4 animate-pulse">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div>
                            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                            <div className="flex space-x-4">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                                <div className="h-4 bg-gray-300 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="h-6 bg-gray-300 rounded w-24 mb-1"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                </div>
            </div>
            {/* Card Body */}
            <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
            </div>
        </div>
    );

    // Error State Component
    const ErrorState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Employees</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
                Retry
            </button>
        </div>
    );

    // Empty State Component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employees Found</h3>
            <p className="text-gray-500 text-center max-w-md">
                {isUrlFiltered
                    ? "The specified employee could not be found."
                    : "No employees match your search criteria. Try adjusting your search terms."
                }
            </p>
        </div>
    );

    return (
        <Tab>
            <TabHeader
                title="Employee Management"
                subtitle="Manage all employee records and information"
                currentPath={currentPath}
            />
            <div>
                {/* Show URL filter info if filtering by employee ID - only when not loading */}
                {!isLoading && (() => {
                    const urlParams = new URLSearchParams(location.search);
                    const empId = urlParams.get('emp');
                    if (empId) {
                        const employee = employees.find(emp => emp._id === empId);
                        return (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-blue-800 font-medium">
                                            {employee
                                                ? `Showing employee: ${employee.name} (${employee.epfNumber})`
                                                : `Filtering by Employee ID: ${empId} (Employee not found)`
                                            }
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate(location.pathname, { replace: true });
                                            setFilteredEmployees(employees);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                        Show All Employees
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

                {/* Search Bar - only show when not loading and no error */}
                {!isLoading && !error && (
                    <EmployeeSearchBar
                        employees={employees}
                        onSearchResults={handleSearchResults}
                        onClearSearch={handleClearSearch}
                        placeholder="Search employees..."
                        disabled={isUrlFiltered}
                    />
                )}

                {/* Conditional rendering based on state */}
                {isLoading ? (
                    // Skeleton loading
                    <div>
                        {[...Array(5)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <ErrorState />
                ) : filteredEmployees.length === 0 ? (
                    <EmptyState />
                ) : (
                    // Employee cards - keeping the original structure
                    filteredEmployees.map((employee, index) => (
                        <div
                            key={employee._id}
                            className="mb-4"
                            style={{
                                animationDelay: `${index * 50}ms`,
                                opacity: 0,
                                animation: `fadeIn 0.3s ease ${index * 50}ms forwards`
                            }}
                        >
                            <EmployeeWFullCard initialEmployee={employee} />
                        </div>
                    ))
                )}
            </div>

            {/* Add CSS animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Tab>
    );
};

export default EmployeesList;