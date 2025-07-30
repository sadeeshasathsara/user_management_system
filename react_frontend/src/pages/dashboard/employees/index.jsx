import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const EmployeesList = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Employee Management"
            subtitle="Manage all employee records and information"
            currentPath={currentPath}
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Employee list will be implemented here...</p>
        </div>
    </Tab>
);

export default EmployeesList;