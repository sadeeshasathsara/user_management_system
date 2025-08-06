import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import AddEpfForm from '../../../components/AddEpf';

const AddEPF = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="Add EPF Entry"
            subtitle="Create a new EPF record"
            currentPath={currentPath}
        />
        <div className="">
            <AddEpfForm />
        </div>
    </Tab>
);

export default AddEPF;