import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const AddEmployee = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Add New Employee"
            subtitle="Create a new employee record"
            currentPath={currentPath}
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Add employee form will be implemented here...</p>
        </div>
    </Tab>
);

export default AddEmployee;