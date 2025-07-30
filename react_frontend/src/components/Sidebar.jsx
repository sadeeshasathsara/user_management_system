import React, { useState } from 'react';
import {
    Home,
    Users,
    Building2,
    Shield,
    UserCog,
    Settings,
    BarChart3,
    X,
    ChevronDown
} from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: 'dashboard' },
        {
            id: 'employees',
            label: 'Employees',
            icon: Users,
            path: 'employees',
            subItems: [
                { id: 'employees-list', label: 'View Employees', path: 'employees' },
                { id: 'employees-add', label: 'Add Employee', path: 'employees/add' }
            ]
        },
        {
            id: 'departments',
            label: 'Departments',
            icon: Building2,
            path: 'departments',
            subItems: [
                { id: 'departments-list', label: 'List Departments', path: 'departments' },
                { id: 'departments-add', label: 'Add Department', path: 'departments/add' }
            ]
        },
        {
            id: 'epf',
            label: 'EPF',
            icon: Shield,
            path: 'epf',
            subItems: [
                { id: 'epf-list', label: 'View EPF Records', path: 'epf' },
                { id: 'epf-add', label: 'Add EPF Entry', path: 'epf/add' }
            ]
        },
        {
            id: 'admins',
            label: 'Admins',
            icon: UserCog,
            path: 'admins',
            subItems: [
                { id: 'admins-list', label: 'List Admins', path: 'admins' },
                { id: 'admins-add', label: 'Add Admin', path: 'admins/add' }
            ]
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            path: 'settings',
            subItems: [
                { id: 'settings-epf', label: 'EPF Configuration', path: 'settings/epf' }
            ]
        },
        { id: 'reports', label: 'Reports', icon: BarChart3, path: 'reports' },
    ];

    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpanded = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleItemClick = (item, subItem = null) => {
        const targetPath = subItem ? subItem.path : item.path;
        setCurrentPage(targetPath);
        setSidebarOpen(false);
    };

    return (
        <>
            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #CBD5E1 #F8FAFC;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #F8FAFC;
                    border-radius: 10px;
                    margin: 8px 0;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, #CBD5E1, #94A3B8);
                    border-radius: 10px;
                    transition: background 0.3s ease;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, #94A3B8, #64748B);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:active {
                    background: linear-gradient(45deg, #64748B, #475569);
                }

                /* Show scrollbar on hover */
                .sidebar-container .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                    transition: width 0.3s ease;
                }

                .sidebar-container:hover .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                /* Fade effect for scrollbar */
                @keyframes fadeInScrollbar {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .sidebar-container:hover .custom-scrollbar::-webkit-scrollbar-thumb {
                    animation: fadeInScrollbar 0.3s ease;
                }
            `}</style>

            <div
                className={`sidebar-container fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Fixed Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white flex-shrink-0">
                    <h1 className="text-xl font-bold text-gray-900">UMS Dashboard</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Navigation Area */}
                <div className="flex-1 overflow-hidden min-h-0">
                    <nav className="h-full overflow-y-auto custom-scrollbar px-3 py-6">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <div key={item.id} className="mb-1">
                                    <button
                                        onClick={() => {
                                            if (item.subItems) {
                                                toggleExpanded(item.id);
                                            } else {
                                                handleItemClick(item);
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === item.path || currentPage.startsWith(item.path + '/')
                                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon
                                                className={`w-5 h-5 mr-3 transition-colors duration-200 ${currentPage === item.path || currentPage.startsWith(item.path + '/')
                                                    ? 'text-blue-600'
                                                    : 'text-gray-500'
                                                    }`}
                                            />
                                            {item.label}
                                        </div>
                                        {item.subItems && (
                                            <ChevronDown
                                                className={`w-4 h-4 transition-all duration-200 ${expandedItems[item.id] ? 'rotate-180' : ''
                                                    } ${currentPage === item.path || currentPage.startsWith(item.path + '/')
                                                        ? 'text-blue-600'
                                                        : 'text-gray-400'
                                                    }`}
                                            />
                                        )}
                                    </button>

                                    {/* Submenu with smooth animation */}
                                    {item.subItems && (
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedItems[item.id]
                                                ? 'max-h-96 opacity-100 mt-1'
                                                : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="ml-8 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <button
                                                        key={subItem.id}
                                                        onClick={() => handleItemClick(item, subItem)}
                                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 relative ${currentPage === subItem.path
                                                            ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'
                                                            }`}
                                                    >
                                                        <span className="relative z-10">{subItem.label}</span>
                                                        {currentPage === subItem.path && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg"></div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Bottom spacing to ensure last item is visible */}
                        <div className="h-6"></div>
                    </nav>
                </div>

                {/* Gradient fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
        </>
    );
};

// Demo component to show the sidebar in action
const App = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen bg-gray-100 flex">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main content area */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                <div className="p-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Page: {currentPage}</h2>
                        <p className="text-gray-600">
                            This is the main content area. The sidebar should be scrollable when there are many menu items.
                        </p>

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors lg:hidden"
                        >
                            Toggle Sidebar
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default App;