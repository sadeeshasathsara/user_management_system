import React, { useState, useEffect } from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import EpfWFullCard from '../../../components/EpfWFullCard';
import { getEmpEpf } from '../../../apis/epf.api';

// Skeleton Card Component
const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex justify-between mt-6">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
    </div>
);

// Skeleton Loading Component
const SkeletonLoader = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
        ))}
    </div>
);

const EPFList = ({ currentPath }) => {
    const [epfRecords, setEpfRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEpfRecords = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getEmpEpf();
            setEpfRecords(res.data || []);
        } catch (err) {
            console.error("Error fetching EPF records:", err);
            setError("Failed to fetch EPF records. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEpfRecords();
    }, []);

    return (
        <Tab>
            <TabHeader
                title="EPF Records"
                subtitle="Manage Employee Provident Fund records"
                currentPath={currentPath}
            />
            <div className="">
                {loading ? (
                    <SkeletonLoader />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                            <div className="text-red-600 mr-3">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-red-800 font-medium">Error</h3>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                                <button
                                    onClick={fetchEpfRecords}
                                    className="text-red-800 underline text-sm mt-2 hover:text-red-900"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EpfWFullCard epfRecords={epfRecords} />
                )}
            </div>
        </Tab>
    );
};

export default EPFList;