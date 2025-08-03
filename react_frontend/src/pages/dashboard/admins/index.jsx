import React from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import AdminWFullCard from '../../../components/AdminWFullCard';
import { getAdmins } from '../../../apis/admin.api';

const AdminsList = ({ currentPath }) => {
    const [admins, setAdmins] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            try {
                const res = await getAdmins();
                setAdmins(res);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    // Return a single React element, not a JS object.
    return (
        admins && admins.length > 0 ? (
            <Tab>
                <TabHeader
                    title="Admin Management"
                    subtitle="Manage system administrators and permissions"
                    currentPath={currentPath}
                />
                <div>
                    <AdminWFullCard adminRecords={admins} />
                </div>
            </Tab>
        ) : (
            <div>No admins found.</div>
        )
    );
};

export default AdminsList;
