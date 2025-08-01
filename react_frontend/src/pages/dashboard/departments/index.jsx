import React, { useEffect, useState } from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import DepartmentWFullCard from '../../../components/DepartmentWFullCard';
import { fetchDepartmentsApi } from '../../../apis/department.api';
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
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const deptId = searchParams.get('dept');

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);

                const query = deptId ? { _id: deptId } : {};
                const res = await fetchDepartmentsApi(query);

                setDepartments(res.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [deptId]);

    return (
        <Tab>
            <TabHeader
                title="Department Management"
                subtitle="Manage company departments and organizational structure"
                currentPath={currentPath}
            />

            {isLoading ? (
                [...Array(3)].map((_, index) => (
                    <div className="mb-4" key={`skeleton-${index}`}>
                        <DepartmentSkeleton />
                    </div>
                ))
            ) : departments && departments.length > 0 ? (
                departments.map((department) => (
                    <div className="mb-4" key={department._id}>
                        <DepartmentWFullCard initialDepartment={department} />
                    </div>
                ))
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Departments Found</h3>
                    <p className="text-gray-600">There are currently no departments in the system.</p>
                </div>
            )}
        </Tab>
    );
};

export default DepartmentsList;