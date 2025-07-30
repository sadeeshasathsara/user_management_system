import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const EPFList = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="EPF Records"
            subtitle="Manage Employee Provident Fund records"
            currentPath={currentPath}
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">EPF records list will be implemented here...</p>
        </div>
    </Tab>
);

export default EPFList;