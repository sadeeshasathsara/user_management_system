import React, { useEffect, useState, useMemo } from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import DepartmentWFullCard from '../../../components/DepartmentWFullCard';
import { fetchDepartmentsApi } from '../../../apis/department.api';
import { getDepartmentStatsApi } from '../../../apis/stats.api';
import { useSearchParams } from 'react-router-dom';

// Skeleton component for department card
const DepartmentSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
            {/* Skeleton Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Icon skeleton */}
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div>
                            {/* Title skeleton */}
                            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                            {/* Date skeleton */}
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                    {/* Action buttons skeleton */}
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>

            {/* Skeleton Body */}
            <div className="px-6 py-5">
                <div className="space-y-4">
                    {/* Description skeleton */}
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0 mt-0.5"></div>
                        <div className="flex-1 min-w-0">
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats skeleton */}
                    <div className="flex items-center space-x-6 pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DepartmentsList = ({ currentPath }) => {
    const [departments, setDepartments] = useState([]);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const deptId = searchParams.get('dept');

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);

                // Fetch departments
                const query = deptId ? { _id: deptId } : {};
                const departmentsRes = await fetchDepartmentsApi(query);
                setDepartments(departmentsRes.data);

                // Fetch department stats
                const statsRes = await getDepartmentStatsApi();
                setDepartmentStats(statsRes.data || []);
            } catch (error) {
                console.error('Error fetching departments:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [deptId]);

    // Filter departments based on search term
    const filteredDepartments = useMemo(() => {
        if (!searchTerm.trim()) {
            return departments;
        }

        return departments.filter(department =>
            department.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
    }, [departments, searchTerm]);

    // Enhanced departments with employee count
    const departmentsWithStats = useMemo(() => {
        return filteredDepartments.map(department => {
            const stats = departmentStats.find(stat => stat.name === department.name);
            return {
                ...department,
                employeeCount: stats?.value || 0
            };
        });
    }, [filteredDepartments, departmentStats]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const clearUrlFilter = () => {
        setSearchParams({});
    };

    return (
        <Tab>
            <TabHeader
                title="Department Management"
                subtitle="Manage company departments and organizational structure"
                currentPath={currentPath}
            />

            {/* Search Bar or Clear Filter */}
            <div className="mb-6">
                {deptId ? (
                    // Clear URL filter when filtered by ID
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-800">
                                    Filtered by Department ID: {deptId}
                                </p>
                                <p className="text-sm text-blue-600">
                                    Showing results for specific department
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearUrlFilter}
                            className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear Filter
                        </button>
                    </div>
                ) : (
                    // Search bar when not filtered by ID
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search departments by name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <svg
                                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isLoading ? (
                [...Array(3)].map((_, index) => (
                    <div className="mb-4" key={`skeleton-${index}`}>
                        <DepartmentSkeleton />
                    </div>
                ))
            ) : departmentsWithStats && departmentsWithStats.length > 0 ? (
                departmentsWithStats.map((department) => (
                    <div className="mb-4" key={department._id}>
                        <DepartmentWFullCard
                            initialDepartment={department}
                            employeeCount={department.employeeCount}
                        />
                    </div>
                ))
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'No Matching Departments Found' : 'No Departments Found'}
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm
                            ? `No departments match your search "${searchTerm}". Try adjusting your search terms.`
                            : 'There are currently no departments in the system.'
                        }
                    </p>
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </Tab>
    );
};

export default DepartmentsList;