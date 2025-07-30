import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const DepartmentsList = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Department Management"
            subtitle="Manage company departments and organizational structure"
            currentPath={currentPath}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Departments list will be implemented here...</p>
        </div>
    </Tab>
);

export default DepartmentsList;