import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import DepartmentWFullCard from '../../../components/DepartmentWFullCard';

const DepartmentsList = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Department Management"
            subtitle="Manage company departments and organizational structure"
            currentPath={currentPath}
        />

        <div className="">
            <DepartmentWFullCard />
        </div>
    </Tab>
);

export default DepartmentsList;