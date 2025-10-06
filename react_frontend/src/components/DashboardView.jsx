import React, { useState, useEffect } from 'react';
import {
    Users,
    Building2,
    DollarSign,
    Wallet,
    UserPlus,
    UserMinus,
    Shield,
    Baby,
    Plus,
    Settings,
    FileText,
    Calendar,
    Clock,
    AlertTriangle,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Search,
    Bell,
    Star,
    Award,
    Zap,
    Target,
    MoreHorizontal,
    ChevronRight,
    Gift,
    MapPin,
    Phone,
    Mail,
    UserCheck,
    Heart,
    GraduationCap,
    Filter,
    ArrowUpDown,
    Grid,
    List
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
// import { Link } from 'react-router-dom'; // Commented out - replace with your routing solution
import { getStatsApi, getDepartmentStatsApi, getEpfMonthlyContributionApi } from '../apis/stats.api'; // Update path as needed

const DashboardView = () => {
    const [stats, setStats] = useState({});
    const [chartData, setChartData] = useState({});
    const [departmentData, setDepartmentData] = useState([]);
    const [loading, setLoading] = useState({
        stats: true,
        departments: true,
        epf: true
    });

    // Department view controls
    const [departmentViewMode, setDepartmentViewMode] = useState('pie');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('count');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Fetch stats data
            try {
                const statsResponse = await getStatsApi();
                if (statsResponse.success) {
                    setStats({
                        totalEmployees: statsResponse.data.employees.totalEmployees,
                        employeeChange: statsResponse.data.employees.change,
                        employeeChangeType: statsResponse.data.employees.type,
                        departmentCount: statsResponse.data.departmentCount,
                        totalEpfThisYear: statsResponse.data.epfThisYear.totalEpfThisYear,
                        epfChange: statsResponse.data.epfThisYear.change,
                        epfChangeType: statsResponse.data.epfThisYear.type,
                        adminUsersCount: statsResponse.data.adminUsersCount
                    });
                }
            } catch (error) {
                console.error('Error fetching stats data:', error);
            } finally {
                setLoading(prev => ({ ...prev, stats: false }));
            }

            // Fetch department data
            try {
                const departmentResponse = await getDepartmentStatsApi();
                if (departmentResponse.success) {
                    setDepartmentData(departmentResponse.data);
                }
            } catch (error) {
                console.error('Error fetching department data:', error);
            } finally {
                setLoading(prev => ({ ...prev, departments: false }));
            }

            // Fetch EPF data
            try {
                const epfResponse = await getEpfMonthlyContributionApi();
                if (epfResponse.success) {
                    setChartData({
                        epfTrend: epfResponse.data
                    });
                }
            } catch (error) {
                console.error('Error fetching EPF data:', error);
            } finally {
                setLoading(prev => ({ ...prev, epf: false }));
            }
        };

        fetchDashboardData();
    }, []);

    // Filter and sort department data
    const filteredDepartmentData = departmentData
        .filter(dept => dept.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                return sortOrder === 'asc'
                    ? a.value - b.value
                    : b.value - a.value;
            }
        });

    const topDepartments = filteredDepartmentData.slice(0, 10);

    const StatCard = ({ icon: Icon, title, value, subtitle, change, changeType, color = 'blue', link }) => {
        const colorClasses = {
            blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
            green: 'bg-green-50 border-green-200 hover:bg-green-100',
            purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
            orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
            pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
            indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
            red: 'bg-red-50 border-red-200 hover:bg-red-100',
            yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
        };

        const iconColorClasses = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
            orange: 'text-orange-600',
            pink: 'text-pink-600',
            indigo: 'text-indigo-600',
            red: 'text-red-600',
            yellow: 'text-yellow-600'
        };

        return (
            <div className={`${colorClasses[color]} border-2 rounded-xl shadow-sm p-5 transition-all duration-200 hover:shadow-md cursor-pointer group`}>
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg bg-white shadow-sm ${iconColorClasses[color]}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {change && (
                        <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${changeType === 'positive'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {changeType === 'positive' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {loading.stats ? '...' : value}
                    </h3>
                    <p className="text-gray-700 font-medium text-sm mb-1">{title}</p>
                    {subtitle && (
                        <p className="text-gray-500 text-xs">{subtitle}</p>
                    )}
                </div>
                {link && (
                    <div onClick={() => window.location.href = link} className="cursor-pointer">
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center text-xs text-gray-600 group-hover:text-gray-800">
                                <span>View Details</span>
                                <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Generate skeleton cards for loading states
    const StatCardSkeleton = ({ color = 'blue' }) => {
        const colorClasses = {
            blue: 'bg-blue-50 border-blue-200',
            green: 'bg-green-50 border-green-200',
            orange: 'bg-orange-50 border-orange-200',
            red: 'bg-red-50 border-red-200'
        };

        return (
            <div className={`${colorClasses[color]} border-2 rounded-xl shadow-sm p-5 animate-pulse`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
                </div>
                <div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        );
    };

    if (loading.stats && loading.departments && loading.epf) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-96 mb-8"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                        <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-7xl mx-auto">

                {/* Quick Access Links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    <div
                        onClick={() => window.location.href = '/epf/add'}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3 cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                        <div className="flex items-center space-x-2">
                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">New Medical</span>
                        </div>
                    </div>

                    <div
                        onClick={() => window.location.href = '/employees/add'}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-3 cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                        <div className="flex items-center space-x-2">
                            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">New Employee</span>
                        </div>
                    </div>

                    <div
                        onClick={() => window.location.href = '/departments/add'}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-3 cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                        <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">New Department</span>
                        </div>
                    </div>

                    <div
                        onClick={() => window.location.href = '/settings/epf'}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-3 cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                        <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Medical Config</span>
                        </div>
                    </div>

                    <div
                        onClick={() => window.location.href = '/settings/backup'}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-3 cursor-pointer hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">System Backup</span>
                        </div>
                    </div>
                </div>

                {/* Key Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {loading.stats ? (
                        <>
                            <StatCardSkeleton color="blue" />
                            <StatCardSkeleton color="green" />
                            <StatCardSkeleton color="orange" />
                            <StatCardSkeleton color="red" />
                        </>
                    ) : (
                        <>
                            <StatCard
                                icon={Users}
                                title="Total Employees"
                                value={stats.totalEmployees?.toLocaleString()}
                                subtitle="Active workforce"
                                change={stats.employeeChange}
                                changeType={stats.employeeChangeType}
                                color="blue"
                                link="/employees"
                            />
                            <StatCard
                                icon={Wallet}
                                title="EPF This Year"
                                value={stats.totalEpfThisYear ? `LKR ${(stats.totalEpfThisYear / 1000).toFixed(1)}K` : 'LKR 0'}
                                subtitle="Total contributions"
                                change={stats.epfChange}
                                changeType={stats.epfChangeType}
                                color="green"
                                link="/epf"
                            />
                            <StatCard
                                icon={Building2}
                                title="Departments"
                                value={stats.departmentCount}
                                subtitle="Active departments"
                                color="orange"
                                link="/departments"
                            />
                            <StatCard
                                icon={Shield}
                                title="Admin Users"
                                value={stats.adminUsersCount}
                                subtitle="System administrators"
                                color="red"
                                link="/admins"
                            />
                        </>
                    )}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                    {/* EPF Contributions Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Medical Contributions</h3>
                                <p className="text-gray-600 text-sm">Monthly contribution trends</p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-600">Amount (LKR)</span>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData.epfTrend || []}>
                                <defs>
                                    <linearGradient id="epfGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${(value / 1000)}K`} />
                                <Tooltip formatter={(value) => [`LKR ${value.toLocaleString()}`, 'EPF Amount']} />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#epfGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>

                        {/* EPF Chart Description */}
                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border-l-4 border-blue-500">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">About This Chart</h4>
                                   <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                 This area chart displays the <span className="font-medium text-blue-700">yearly medical bill reimbursements</span> provided to employees. The chart visualizes the total medical expenses covered by the company each year, helping you track healthcare support trends and identify variations over time.
                                </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span><strong>Peak contributions:</strong> Identify months with highest Medical payouts</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                            <span><strong>Trend analysis:</strong> Monitor growth or decline patterns</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span><strong>Financial planning:</strong> Forecast future contribution requirements</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span><strong>Compliance tracking:</strong> Ensure consistent contribution schedules</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Department Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Department Distribution</h3>
                                <p className="text-gray-600 text-sm">Employee count across departments</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setDepartmentViewMode('pie')}
                                    className={`p-2 rounded-lg border transition-colors ${departmentViewMode === 'pie' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                    title="Pie Chart"
                                >
                                    <PieChart className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDepartmentViewMode('list')}
                                    className={`p-2 rounded-lg border transition-colors ${departmentViewMode === 'list' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                    title="List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Search and Sort for List View */}
                        {departmentViewMode === 'list' && (
                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search departments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex space-x-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="count">Sort by Count</option>
                                        <option value="name">Sort by Name</option>
                                    </select>

                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
                                        title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                                    >
                                        <ArrowUpDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Department Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {departmentViewMode === 'pie' && departmentData.length > 0 && (
                                <>
                                    <div className="flex justify-center">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={departmentData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={120}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {departmentData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [value, 'Employees']} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-2 max-h-80 overflow-y-auto">
                                        {departmentData.map((dept, index) => (
                                            <div key={index} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dept.color || '#3B82F6' }}></div>
                                                    <span className="text-gray-700" title={dept.name}>{dept.name}</span>
                                                </div>
                                                <span className="font-semibold text-gray-900">{dept.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {departmentViewMode === 'list' && (
                                <div className="lg:col-span-2">
                                    {filteredDepartmentData.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                                            {filteredDepartmentData.map((dept, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className="w-4 h-4 rounded-full"
                                                            style={{ backgroundColor: dept.color || '#3B82F6' }}
                                                        ></div>
                                                        <span className="font-medium text-gray-900 text-sm truncate" title={dept.name}>{dept.name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Users className="w-4 h-4 text-gray-400" />
                                                        <span className="font-semibold text-gray-900">{dept.value}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>No departments found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {departmentData.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No department data available</p>
                            </div>
                        )}

                        {/* Summary Stats */}
                        {departmentData.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-xl font-bold text-gray-900">
                                            {departmentData.length}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Departments</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-gray-900">
                                            {departmentData.reduce((sum, dept) => sum + dept.value, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Employees</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-gray-900">
                                            {Math.round(departmentData.reduce((sum, dept) => sum + dept.value, 0) / departmentData.length)}
                                        </div>
                                        <div className="text-sm text-gray-600">Avg per Department</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;