import { getEmployeesByQuery } from "../services/employee.service.js";
import departmentService from "../services/department.service.js";
import { getEmployeeEpfs } from "../services/epf.service.js";
import { getAdmins } from "../services/register.service.js";

export const statsController = async (req, res) => {
    try {
        const data = {
            employees: {
                totalEmployees: null,
                change: null,
                type: null
            },
            departmentCount: null,
            epfThisYear: {
                totalEpfThisYear: 0,
                change: null,
                type: null
            },
            adminUsersCount: null,
        };

        const employees = await getEmployeesByQuery({});
        data.employees.totalEmployees = employees.length;

        const now = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(now.getMonth() - 2);

        // Employees joined in the last 2 months excluding this month
        const lastTwoMonthsCount = employees.filter(emp => {
            const joined = new Date(emp.joinedDate);
            return joined >= twoMonthsAgo && joined < new Date(now.getFullYear(), now.getMonth(), 1);
        }).length;

        // Employees joined this month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const thisMonthCount = employees.filter(emp => {
            const joined = new Date(emp.joinedDate);
            return joined >= startOfMonth && joined < startOfNextMonth;
        }).length;

        // Calculate employees % change if past data exists, else set null
        if (lastTwoMonthsCount === 0) {
            data.employees.change = null;
            data.employees.type = null;
        } else {
            const change = ((thisMonthCount - lastTwoMonthsCount) / lastTwoMonthsCount) * 100;
            const formattedChange = `${change.toFixed(1)}%`;

            data.employees.change = formattedChange;
            data.employees.type = change >= 0 ? 'positive' : 'negative';
        }

        const departments = await departmentService.getAllDepartments({});
        data.departmentCount = departments.data.length;

        const epfs = await getEmployeeEpfs({});

        // Calculate total EPF for this year and last year
        let totalEpfThisYear = 0;
        let totalEpfLastYear = 0;
        const currentYear = now.getFullYear();
        const lastYear = currentYear - 1;

        epfs.data.forEach(epf => {
            const epfYear = new Date(epf.year).getFullYear();
            if (epfYear === currentYear) {
                totalEpfThisYear += epf.expense;
            } else if (epfYear === lastYear) {
                totalEpfLastYear += epf.expense;
            }
        });

        data.epfThisYear.totalEpfThisYear = totalEpfThisYear;

        // Calculate EPF % change if last year's data exists, else null
        if (totalEpfLastYear === 0) {
            data.epfThisYear.change = null;
            data.epfThisYear.type = null;
        } else {
            const epfChange = ((totalEpfThisYear - totalEpfLastYear) / totalEpfLastYear) * 100;
            data.epfThisYear.change = `${epfChange.toFixed(1)}%`;
            data.epfThisYear.type = epfChange >= 0 ? 'positive' : 'negative';
        }

        const admins = await getAdmins();
        data.adminUsersCount = admins.length;

        return res.status(200).json({ success: true, data: data });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const departmentStats = async (req, res) => {
    try {
        const employees = await getEmployeesByQuery({});

        const grouped = employees.reduce((acc, emp) => {
            if (!emp.department) return acc;

            const deptId = emp.department._id.toString();

            if (!acc[deptId]) {
                acc[deptId] = {
                    name: emp.department.name,
                    value: 0,
                    color: getRandomColor(),
                };
            }

            acc[deptId].value++;
            return acc;
        }, {});

        const groupedArray = Object.values(grouped);

        return res.status(200).json({ success: true, data: groupedArray });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const epfMonthlyContribution = async (req, res) => {
    try {
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

        const { data: epfRecordsResult } = await getEmployeeEpfs({});
        const epfRecords = epfRecordsResult || [];

        // Initialize monthly map (Jan to Dec, amount 0)
        const monthlyMap = {};
        monthNames.forEach(month => {
            monthlyMap[month] = 0;
        });

        for (const record of epfRecords) {
            const regulars = record.regularExpenses?.items || [];
            const ranges = record.rangeExpenses || [];

            // Regular expenses
            for (const exp of regulars) {
                const date = new Date(exp.expensedAt);
                if (date >= oneYearAgo && date <= now) {
                    const month = monthNames[date.getMonth()];
                    monthlyMap[month] += exp.amount || 0;
                }
            }

            // Range expenses
            for (const range of ranges) {
                for (const exp of range.expenses || []) {
                    const date = new Date(exp.expensedAt);
                    if (date >= oneYearAgo && date <= now) {
                        const month = monthNames[date.getMonth()];
                        monthlyMap[month] += exp.amount || 0;
                    }
                }
            }
        }

        // Convert monthlyMap to sorted array by calendar month order
        const monthlyTotals = monthNames.map(month => ({
            month,
            amount: monthlyMap[month] || 0
        }));

        return res.status(200).json({
            success: true,
            data: monthlyTotals
        });

    } catch (err) {
        console.error("Error calculating EPF monthly contribution:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};