import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';

const Reports = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Reports & Analytics"
            subtitle="View charts, statistics, and salary breakdowns"
            currentPath={currentPath}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Reports and analytics will be implemented here...</p>
        </div>
    </Tab>
);

export default Reports;