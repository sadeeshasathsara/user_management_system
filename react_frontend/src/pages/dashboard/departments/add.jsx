import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import AddDepartmentForm from '../../../components/AddDepartment';

const AddDepartment = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Add New Department"
            subtitle="Create a new department"
            currentPath={currentPath}
        />

        <div className="">
            <AddDepartmentForm />
        </div>
    </Tab>
);

export default AddDepartment;