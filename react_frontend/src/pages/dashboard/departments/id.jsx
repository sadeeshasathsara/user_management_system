import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const EditDepartment = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Edit Department"
            subtitle="Modify department information"
            currentPath={currentPath}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Edit department form will be implemented here...</p>
        </div>
    </Tab>
);

export default EditDepartment;