import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import AddAdminForm from '../../../components/AddAdmin';

const AddAdmin = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Add New Admin"
            subtitle="Create a new administrator account"
            currentPath={currentPath}

        />
        <div className="">
            <AddAdminForm />
        </div>
    </Tab>
);

export default AddAdmin;