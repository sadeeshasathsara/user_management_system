import React from 'react';
import { Users, UserX } from 'lucide-react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import AdminWFullCard from '../../../components/AdminWFullCard';
import { getAdmins } from '../../../apis/admin.api';

// Skeleton loading component
const AdminSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-300 rounded-full h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                    <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                </div>
                <div className="bg-gray-300 h-8 w-24 rounded"></div>
            </div>
        </div>
        <div className="bg-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-300 rounded-full h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                    <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                    <div className="bg-gray-300 h-3 rounded w-1/3"></div>
                </div>
                <div className="bg-gray-300 h-8 w-24 rounded"></div>
            </div>
        </div>
        <div className="bg-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-300 rounded-full h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                    <div className="bg-gray-300 h-4 rounded w-4/5"></div>
                    <div className="bg-gray-300 h-3 rounded w-2/5"></div>
                </div>
                <div className="bg-gray-300 h-8 w-24 rounded"></div>
            </div>
        </div>
    </div>
);

// Empty state component
const EmptyAdminsState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-6">
            <UserX className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Administrators Found
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
            There are currently no administrators in the system. You may need to add administrators to manage the platform effectively.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Add Administrator
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                Refresh
            </button>
        </div>
    </div>
);

const AdminsList = ({ currentPath }) => {
    const [admins, setAdmins] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getAdmins();
            setAdmins(res);
        } catch (err) {
            console.log(err);
            setError(err.message || 'Failed to fetch administrators');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAdmins();
    }, []);

    // Show loading skeleton
    if (loading) {
        return (
            <Tab>
                <TabHeader
                    title="Admin Management"
                    subtitle="Manage system administrators and permissions"
                    currentPath={currentPath}
                />
                <div className="space-y-4">
                    <AdminSkeleton />
                </div>
            </Tab>
        );
    }

    // Show error state
    if (error) {
        return (
            <Tab>
                <TabHeader
                    title="Admin Management"
                    subtitle="Manage system administrators and permissions"
                    currentPath={currentPath}
                />
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                    <div className="bg-red-100 rounded-full p-4 mb-6">
                        <UserX className="h-12 w-12 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Error Loading Administrators
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                        {error}
                    </p>
                    <button
                        onClick={fetchAdmins}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </Tab>
        );
    }

    // Show empty state
    if (!admins || admins.length === 0) {
        return (
            <Tab>
                <TabHeader
                    title="Admin Management"
                    subtitle="Manage system administrators and permissions"
                    currentPath={currentPath}
                />
                <EmptyAdminsState />
            </Tab>
        );
    }

    // Show admins list
    return (
        <Tab>
            <TabHeader
                title="Admin Management"
                subtitle="Manage system administrators and permissions"
                currentPath={currentPath}
            />
            <div>
                <AdminWFullCard adminRecords={admins} />
            </div>
        </Tab>
    );
};

export default AdminsList;