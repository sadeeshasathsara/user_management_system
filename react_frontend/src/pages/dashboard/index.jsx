import React from 'react';
import Tab from '../../layout/Tab';
import TabHeader from '../../components/TabHeader';
import { Users, Building2, Shield, UserCog } from 'lucide-react';
import DashboardView from '../../components/DashboardView';

const DashboardHome = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Dashboard Overview"
            subtitle="Welcome to the User Management System"
            currentPath={currentPath}
        />

        <div className="">
            <DashboardView />
        </div>
    </Tab>
);

export default DashboardHome;