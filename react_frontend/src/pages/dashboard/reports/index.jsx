import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import EPFReportWidget from '../../../components/EpfReportWidget';

const Reports = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Reports & Analytics"
            subtitle="View charts, statistics, and salary breakdowns"
            currentPath={currentPath}
        />


        <EPFReportWidget />

    </Tab>
);

export default Reports;