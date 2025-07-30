import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const AddEPF = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Add EPF Entry"
            subtitle="Create a new EPF record"
            currentPath={currentPath}
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Add EPF entry form will be implemented here...</p>
        </div>
    </Tab>
);

export default AddEPF;