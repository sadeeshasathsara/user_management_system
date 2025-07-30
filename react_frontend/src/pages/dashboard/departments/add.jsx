import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const AddDepartment = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Add New Department"
            subtitle="Create a new department"
            currentPath={currentPath}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Add department form will be implemented here...</p>
        </div>
    </Tab>
);

export default AddDepartment;