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
    GraduationCap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const DashboardView = () => {
    const [stats, setStats] = useState({});
    const [chartData, setChartData] = useState({});
    const [recentActivity, setRecentActivity] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                throw new Error('API not implemented - using mock data');
            } catch (error) {
                // Mock data aligned with actual UMS structure
                setStats({
                    totalEmployees: 247,
                    departmentCount: 8,
                    totalEPFThisYear: 2847500,
                    totalSalaryThisMonth: 12450000,
                    totalDependents: 89,
                    adminUsersCount: 5,
                    recentJoinsThisMonth: 12,
                    exitsThisYear: 8,
                    totalSpouses: 156,
                    totalChildren: 78,
                    totalParents: 45
                });

                setChartData({
                    epfTrend: [
                        { month: 'Jan', amount: 245000 },
                        { month: 'Feb', amount: 268000 },
                        { month: 'Mar', amount: 252000 },
                        { month: 'Apr', amount: 278000 },
                        { month: 'May', amount: 265000 },
                        { month: 'Jun', amount: 289000 },
                        { month: 'Jul', amount: 275000 }
                    ],
                    departmentData: [
                        { name: 'Engineering', value: 68, color: '#3B82F6' },
                        { name: 'Sales', value: 45, color: '#10B981' },
                        { name: 'Marketing', value: 32, color: '#F59E0B' },
                        { name: 'HR', value: 28, color: '#EF4444' },
                        { name: 'Finance', value: 24, color: '#8B5CF6' },
                        { name: 'Operations', value: 35, color: '#06B6D4' },
                        { name: 'Support', value: 15, color: '#84CC16' }
                    ],
                    salaryTrend: [
                        { month: 'Jan', amount: 11200000 },
                        { month: 'Feb', amount: 11800000 },
                        { month: 'Mar', amount: 12100000 },
                        { month: 'Apr', amount: 12300000 },
                        { month: 'May', amount: 12200000 },
                        { month: 'Jun', amount: 12450000 }
                    ]
                });

                setRecentActivity({
                    recentEmployees: [
                        { id: 1, name: 'Sarah Johnson', department: 'Engineering', joinDate: '2025-07-28', employeeId: 'EMP001' },
                        { id: 2, name: 'Mike Chen', department: 'Sales', joinDate: '2025-07-25', employeeId: 'EMP002' },
                        { id: 3, name: 'Emily Davis', department: 'Marketing', joinDate: '2025-07-22', employeeId: 'EMP003' },
                        { id: 4, name: 'James Wilson', department: 'Finance', joinDate: '2025-07-20', employeeId: 'EMP004' }
                    ],
                    recentEPF: [
                        { id: 1, employee: 'John Smith', employeeId: 'EMP045', amount: 12500, date: '2025-07-30' },
                        { id: 2, employee: 'Anna Williams', employeeId: 'EMP067', amount: 15800, date: '2025-07-29' },
                        { id: 3, employee: 'David Lee', employeeId: 'EMP089', amount: 18200, date: '2025-07-28' },
                        { id: 4, employee: 'Maria Garcia', employeeId: 'EMP012', amount: 14600, date: '2025-07-27' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                        {loading ? '...' : value}
                    </h3>
                    <p className="text-gray-700 font-medium text-sm mb-1">{title}</p>
                    {subtitle && (
                        <p className="text-gray-500 text-xs">{subtitle}</p>
                    )}
                </div>
                {link && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center text-xs text-gray-600 group-hover:text-gray-800">
                            <span>View Details</span>
                            <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-96 mb-8"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
                {/* Key Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        title="Total Employees"
                        value={stats.totalEmployees?.toLocaleString()}
                        subtitle="Active workforce"
                        change="+5.2%"
                        changeType="positive"
                        color="blue"
                        link="/employees"
                    />
                    <StatCard
                        icon={Wallet}
                        title="EPF This Year"
                        value={`LKR ${(stats.totalEPFThisYear / 1000000).toFixed(1)}M`}
                        subtitle="Total contributions"
                        change="+12.3%"
                        changeType="positive"
                        color="green"
                        link="/epf"
                    />
                    <StatCard
                        icon={DollarSign}
                        title="Salary This Month"
                        value={`LKR ${(stats.totalSalaryThisMonth / 1000000).toFixed(1)}M`}
                        subtitle="Total disbursed"
                        color="purple"
                        link="/salary"
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
                        link="/admin"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Team Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Team Distribution</h3>
                                <p className="text-gray-600 text-sm">Employees by department</p>
                            </div>
                            <Eye className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={chartData.departmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {chartData.departmentData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, 'Employees']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                            {chartData.departmentData?.slice(0, 5).map((dept, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                                        <span className="text-gray-600">{dept.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{dept.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EPF Trend */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">EPF Contributions</h3>
                                <p className="text-gray-600 text-sm">Monthly contribution trends</p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-600">Amount (LKR)</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={chartData.epfTrend}>
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
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Employees */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Employees</h3>
                                <p className="text-gray-600 text-sm">Latest additions to the team</p>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                                <span>View All</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.recentEmployees?.map((employee) => (
                                <div key={employee.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                                        {employee.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                                        <p className="text-sm text-gray-500">{employee.employeeId} • {employee.department}</p>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(employee.joinDate).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent EPF Updates */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent EPF Entries</h3>
                                <p className="text-gray-600 text-sm">Latest contribution records</p>
                            </div>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
                                <span>View All</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.recentEPF?.map((epf) => (
                                <div key={epf.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{epf.employee}</p>
                                        <p className="text-sm text-gray-500">{epf.employeeId} • {epf.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">LKR {epf.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;