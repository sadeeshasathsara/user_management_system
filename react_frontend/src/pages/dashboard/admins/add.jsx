import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const AddAdmin = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Add New Admin"
            subtitle="Create a new administrator account"
            currentPath={currentPath}

        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Add admin form will be implemented here...</p>
        </div>
    </Tab>
);

export default AddAdmin;