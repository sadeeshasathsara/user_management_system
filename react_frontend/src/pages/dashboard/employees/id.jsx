import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const ViewEditEmployee = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Employee Details"
            subtitle="View and edit employee information"
            currentPath={currentPath}
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Employee details form will be implemented here...</p>
        </div>
    </Tab>
);

export default ViewEditEmployee;