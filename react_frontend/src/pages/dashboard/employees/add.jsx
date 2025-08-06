import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import AddEmployeeForm from '../../../components/AddEmployee';

const AddEmployee = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Add New Employee"
            subtitle="Create a new employee record"
            currentPath={currentPath}
        />
        <div className="">
            <AddEmployeeForm />
        </div>
    </Tab>
);

export default AddEmployee;