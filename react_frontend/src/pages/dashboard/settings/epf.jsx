import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import EPFConfigForm from '../../../components/UpdateEpfConfiguration';

const EPFSettings = ({ currentPath }) => (
    <Tab>
        <TabHeader
            title="EPF Configuration"
            subtitle="Configure EPF settings and maximum values"
            currentPath={currentPath}
        />
        <div className="">
            <EPFConfigForm />
        </div>
    </Tab>
);

export default EPFSettings;