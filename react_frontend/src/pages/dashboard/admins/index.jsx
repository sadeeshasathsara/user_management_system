import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import AdminWFullCard from '../../../components/AdminWFullCard';

const AdminsList = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Admin Management"
            subtitle="Manage system administrators and permissions"
            currentPath={currentPath}

        />
        <div className="">
            <AdminWFullCard />
        </div>
    </Tab>
);

export default AdminsList;