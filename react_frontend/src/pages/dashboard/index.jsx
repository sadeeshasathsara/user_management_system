import React from 'react';
import Tab from '../../layout/Tab';
import TabHeader from '../../components/TabHeader';
import { Users, Building2, Shield, UserCog } from 'lucide-react';

const DashboardHome = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Dashboard Overview"
            subtitle="Welcome to the User Management System"
            currentPath={currentPath}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Employees</p>
                        <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                    <Building2 className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Departments</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                    <Shield className="w-8 h-8 text-purple-500" />
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active EPF</p>
                        <p className="text-2xl font-bold text-gray-900">987</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                    <UserCog className="w-8 h-8 text-orange-500" />
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Admins</p>
                        <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <p className="text-gray-600">Dashboard content will be implemented here...</p>
        </div>
    </Tab>
);

export default DashboardHome;