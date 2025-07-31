import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import EpfWFullCard from '../../../components/EpfWFullCard';

const EPFList = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="EPF Records"
            subtitle="Manage Employee Provident Fund records"
            currentPath={currentPath}
        />
        <div className="">
            <EpfWFullCard />
        </div>
    </Tab>
);

export default EPFList;