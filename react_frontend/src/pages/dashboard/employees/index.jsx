import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tab from '../../../layout/Tab';
import TabHeader from '../../../components/TabHeader';
import EmployeeWFullCard from '../../../components/EmployeeWFullCard';
import EmployeeSearchBar from '../../../components/EmployeeSearchbar';

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
        }, 0);
    });
};

const EmployeesList = ({ currentPath }) => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isUrlFiltered, setIsUrlFiltered] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSearchResults = (results) => {
        setFilteredEmployees(results);
    };

    const handleClearSearch = () => {
        setFilteredEmployees(employees);
        // Clear URL parameters when clearing search
        if (location.search) {
            navigate(location.pathname, { replace: true });
        }
    };

    useEffect(() => {
        const loadEmployees = async () => {
            const data = await fetchEmployees();
            setEmployees(data);
            setFilteredEmployees(data); // Initialize filteredEmployees with loaded data
        };
        loadEmployees();
    }, []);

    // Handle URL parameter filtering
    useEffect(() => {
        if (employees.length === 0) return;

        const urlParams = new URLSearchParams(location.search);
        const empId = urlParams.get('emp');

        if (empId) {
            const filteredEmployee = employees.filter(employee => employee._id === empId);
            setFilteredEmployees(filteredEmployee);
            setIsUrlFiltered(true); // mark as URL-filtered
        } else {
            setFilteredEmployees(employees);
            setIsUrlFiltered(false); // no URL filter
        }
    }, [location.search, employees]);


    return (
        <Tab>
            <TabHeader
                title="Employee Management"
                subtitle="Manage all employee records and information"
                currentPath={currentPath}
            />
            <div>
                {/* Show URL filter info if filtering by employee ID */}
                {(() => {
                    const urlParams = new URLSearchParams(location.search);
                    const empId = urlParams.get('emp');
                    if (empId) {
                        const employee = employees.find(emp => emp._id === empId);
                        return (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-blue-800 font-medium">
                                            {employee
                                                ? `Showing employee: ${employee.name} (${employee.epfNumber})`
                                                : `Filtering by Employee ID: ${empId} (Employee not found)`
                                            }
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate(location.pathname, { replace: true });
                                            setFilteredEmployees(employees);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                        Show All Employees
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

                <EmployeeSearchBar
                    employees={employees}
                    onSearchResults={handleSearchResults}
                    onClearSearch={handleClearSearch}
                    placeholder="Search employees..."
                    disabled={isUrlFiltered}
                />

                {filteredEmployees.map(employee => (
                    <div key={employee._id} className='mb-4'>
                        <EmployeeWFullCard initialEmployee={employee} />
                    </div>
                ))}
            </div>
        </Tab>
    );
};

export default EmployeesList;