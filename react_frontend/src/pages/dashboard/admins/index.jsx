import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const AdminsList = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Admin Management"
            subtitle="Manage system administrators and permissions"
            currentPath={currentPath}

        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Admins list will be implemented here...</p>
        </div>
    </Tab>
);

export default AdminsList;