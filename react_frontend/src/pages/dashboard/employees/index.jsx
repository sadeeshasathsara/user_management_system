import React, { useEffect, useState } from 'react';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import EmployeeWFullCard from './EmployeeWFullCard';

const fetchEmployees = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    _id: '1',
                    epfNumber: 'EPF001',
                    name: 'John Doe',
                    address: '123 Main Street, Colombo 03',
                    dateOfBirth: '1990-05-15T00:00:00Z',
                    nicNumber: '901234567V',
                    gender: 'Male',
                    email: 'john.doe@company.com',
                    department: {
                        _id: 'dept1',
                        name: 'Human Resources'
                    },
                    joinedDate: '2022-01-15T00:00:00Z',
                    basicSalary: 75000,
                    employmentType: 'Permanent',
                    profilePicture: '',
                    maritalStatus: 'Married',
                    spouseName: 'Jane Doe',
                    parents: [],
                    children: [
                        {
                            name: 'Alice Doe',
                            dateOfBirth: '2018-03-10T00:00:00Z',
                            gender: 'Female',
                            school: 'Royal College',
                            grade: 'Grade 6'
                        },
                        {
                            name: 'Bob Doe',
                            dateOfBirth: '2020-08-22T00:00:00Z',
                            gender: 'Male',
                            school: 'Trinity College',
                            grade: 'Grade 4'
                        }
                    ],
                    contactNumber: '+94771234567',
                    createdAt: '2022-01-15T10:30:00Z',
                    updatedAt: '2024-07-20T14:45:00Z'
                },
                {
                    _id: '2',
                    epfNumber: 'EPF002',
                    name: 'Sarah Silva',
                    address: '456 Galle Road, Mount Lavinia',
                    dateOfBirth: '1995-08-20T00:00:00Z',
                    nicNumber: '955432167V',
                    gender: 'Female',
                    email: 'sarah.silva@company.com',
                    department: {
                        _id: 'dept2',
                        name: 'Information Technology'
                    },
                    joinedDate: '2023-03-01T00:00:00Z',
                    basicSalary: 85000,
                    employmentType: 'Permanent',
                    profilePicture: '',
                    maritalStatus: 'Unmarried',
                    spouseName: '',
                    parents: [
                        {
                            name: 'David Silva',
                            relationship: 'Father',
                            contactNumber: '+94712345678'
                        },
                        {
                            name: 'Mary Silva',
                            relationship: 'Mother',
                            contactNumber: '+94723456789'
                        }
                    ],
                    children: [],
                    contactNumber: '+94779876543',
                    createdAt: '2023-03-01T09:15:00Z',
                    updatedAt: '2024-07-22T11:30:00Z'
                }
            ]);
        }, 3000);
    });
};

const EmployeesList = ({ currentPath }) => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const loadEmployees = async () => {
            const data = await fetchEmployees();
            setEmployees(data);
        };
        loadEmployees();
    }, []);

    return (
        <Tab>
            <TabHeader
                title="Employee Management"
                subtitle="Manage all employee records and information"
                currentPath={currentPath}
            />
            <div>
                {employees.map(emp => (
                    <div key={emp._id} className='mb-4'>
                        <EmployeeWFullCard initialEmployee={emp} />
                    </div>
                ))}
            </div>
        </Tab>
    );
};

export default EmployeesList;
