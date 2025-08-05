import EmployeeEpf from "../models/employeeEpf.model.js";
import EPF from "../models/epf.model.js";

export const updateMaxEpf = async (data) => {
    try {
        // Handle both old format (just maxEpf) and new format (maxEpf with ranges)
        const updateData = typeof data === 'number' ? { maxEpf: data } : data;

        const updatedEpf = await EPF.findOneAndUpdate(
            {},
            updateData,
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );
        return updatedEpf;
    } catch (err) {
        console.error('Service error updating EPF:', err);
        throw err;
    }
};

export const getMaxEpf = async () => {
    try {
        const epf = await EPF.findOne({});
        return epf;
    } catch (err) {
        console.error('Service error fetching EPF:', err);
        throw err;
    }
};

// Additional helper functions for range management
export const getEpfRanges = async () => {
    try {
        const epf = await EPF.findOne({});
        return epf ? epf.ranges || [] : [];
    } catch (err) {
        console.error('Service error fetching EPF ranges:', err);
        throw err;
    }
};

export const validateEpfNumberAgainstRanges = async (epfNumber) => {
    try {
        const epfConfig = await EPF.findOne({});
        if (!epfConfig) {
            return { valid: false, message: 'EPF configuration not found' };
        }

        // Check against system maximum
        if (epfNumber > epfConfig.maxEpf) {
            return {
                valid: false,
                message: `EPF number ${epfNumber} exceeds system maximum ${epfConfig.maxEpf}`
            };
        }

        // If ranges are configured, find which range this EPF number belongs to
        if (epfConfig.ranges && epfConfig.ranges.length > 0) {
            const sortedRanges = epfConfig.ranges.sort((a, b) => a.maxValue - b.maxValue);

            for (const range of sortedRanges) {
                if (epfNumber <= range.maxValue) {
                    return {
                        valid: true,
                        range: range.name,
                        message: `EPF number ${epfNumber} belongs to ${range.name} range`
                    };
                }
            }

            // If no range found, it means it's above all ranges but below system max
            return {
                valid: true,
                range: 'Unassigned',
                message: `EPF number ${epfNumber} is above all configured ranges but within system limit`
            };
        }

        return {
            valid: true,
            message: `EPF number ${epfNumber} is valid (within system maximum ${epfConfig.maxEpf})`
        };
    } catch (err) {
        console.error('Service error validating EPF number:', err);
        throw err;
    }
};

export const getEmployeeEpfs = async (query = {}) => {
    try {
        const filter = {};

        if (query.user) {
            filter.user = query.user;
        }

        if (query.year) {
            const start = new Date(`${query.year}-01-01T00:00:00.000Z`);
            const end = new Date(`${parseInt(query.year) + 1}-01-01T00:00:00.000Z`);
            filter.year = { $gte: start, $lt: end };
        }

        const epfRecords = await EmployeeEpf.find(filter)
            .populate("user", "name email epfNumber")
            .sort({ year: 1 });

        const enrichedRecords = epfRecords.map(record => {
            const regularExpenseTotal = (record.regularExpenses || []).reduce(
                (sum, exp) => sum + (exp.amount || 0),
                0
            );

            const rangeExpenses = (record.rangeExpenses || []).map(range => {
                const rangeExpenseTotal = (range.expenses || []).reduce(
                    (sum, exp) => sum + (exp.amount || 0),
                    0
                );
                return {
                    ...range.toObject(),
                    expense: rangeExpenseTotal
                };
            });

            const rangeExpenseTotal = rangeExpenses.reduce(
                (sum, r) => sum + (r.expense || 0),
                0
            );

            return {
                ...record.toObject(),
                expense: regularExpenseTotal + rangeExpenseTotal,
                rangeExpenses,
                regularExpenses: {
                    expense: regularExpenseTotal,
                    items: record.regularExpenses
                }
            };
        });

        return {
            success: true,
            data: enrichedRecords
        };

    } catch (err) {
        console.error("Error fetching Employee EPF records:", err);
        return {
            success: false,
            message: "Failed to fetch records.",
            error: err.message || err
        };
    }
};



export const createOrUpdateEmployeeEpf = async (payload) => {
    const {
        user,
        year,
        rangeExpenses = [],
        regularExpenses = [],
        method = "update" // default to replacing behavior
    } = payload;

    const start = new Date(Date.UTC(new Date(year).getFullYear(), 0, 1));
    const end = new Date(Date.UTC(new Date(year).getFullYear() + 1, 0, 1));

    let record = await EmployeeEpf.findOne({ user, year: { $gte: start, $lt: end } });

    if (!record) {
        record = new EmployeeEpf({
            user,
            year: start,
            rangeExpenses,
            regularExpenses
        });
    } else {
        if (method === "add") {
            // Append new regular expenses
            record.regularExpenses.push(...regularExpenses);

            // Merge range expenses
            for (const newRange of rangeExpenses) {
                const existingRange = record.rangeExpenses.find(r => r.name === newRange.name);

                if (existingRange) {
                    existingRange.expenses.push(...newRange.expenses);
                } else {
                    record.rangeExpenses.push(newRange);
                }
            }

        } else {
            // Replace regular expenses
            record.regularExpenses = [...regularExpenses];

            // Replace range expenses
            for (const newRange of rangeExpenses) {
                const existingRange = record.rangeExpenses.find(r => r.name === newRange.name);

                if (existingRange) {
                    existingRange.expenses = [...newRange.expenses];
                } else {
                    record.rangeExpenses.push(newRange);
                }
            }

            // Remove any old range not in new list
            const newRangeNames = rangeExpenses.map(r => r.name);
            record.rangeExpenses = record.rangeExpenses.filter(r => newRangeNames.includes(r.name));
        }
    }

    // Calculate total expense
    const totalRegular = record.regularExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalRange = record.rangeExpenses.reduce(
        (sum, r) => sum + r.expenses.reduce((s, e) => s + (e.amount || 0), 0),
        0
    );
    const totalExpense = totalRegular + totalRange;

    if (totalExpense > 15000) {
        throw new Error("Total expense exceeds 15000 limit.");
    }

    record.expense = totalExpense;

    await record.save();
    return record;
};



export const deleteEmployeeEpfExpense = async ({ epfId, type, createdAt, rangeName }) => {
    try {
        const epfRecord = await EmployeeEpf.findById(epfId);
        if (!epfRecord) {
            throw new Error("EPF record not found");
        }

        if (type === "regular") {
            epfRecord.regularExpenses = epfRecord.regularExpenses.filter(
                exp => exp.createdAt.toISOString() !== createdAt
            );
        } else if (type === "range") {
            const range = epfRecord.rangeExpenses.find(r => r.name === rangeName);
            if (!range) throw new Error("Range not found");

            range.expenses = range.expenses.filter(
                exp => exp.createdAt.toISOString() !== createdAt
            );
        } else {
            throw new Error("Invalid type: must be 'regular' or 'range'");
        }

        await epfRecord.save();

        return { success: true, message: "Expense deleted successfully" };
    } catch (err) {
        console.error("Error deleting EPF expense:", err);
        throw new Error(err.message || "Failed to delete EPF expense");
    }
};

