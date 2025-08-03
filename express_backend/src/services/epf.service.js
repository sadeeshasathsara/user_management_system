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
            .populate("user", "name email")
            .sort({ year: 1 });

        // Add computed fields to each record
        const enrichedRecords = epfRecords.map(record => {
            // Compute total from regularExpenses
            const regularExpenseTotal = (record.regularExpenses || []).reduce(
                (sum, exp) => sum + (exp.amount || 0),
                0
            );

            // Add `expense` to each range
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

            // Compute total from rangeExpenses
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
            message: "Internal server error",
            error: err.message
        };
    }
};


export const createOrUpdateEmployeeEpf = async (payload) => {
    const { user, year, rangeExpenses = [], regularExpenses = [] } = payload;

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
        // Update regularExpenses
        if (regularExpenses.length > 0) {
            record.regularExpenses.push(...regularExpenses);
        }

        // Update or merge rangeExpenses
        for (const newRange of rangeExpenses) {
            const existingRange = record.rangeExpenses.find(
                (r) => r.name === newRange.name
            );

            if (existingRange) {
                existingRange.expenses.push(...newRange.expenses);
            } else {
                record.rangeExpenses.push(newRange);
            }
        }
    }

    // Calculate total expense
    const totalRegular = record.regularExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRange = record.rangeExpenses.reduce(
        (sum, r) => sum + r.expenses.reduce((s, e) => s + e.amount, 0),
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

export const deleteEmployeeEpf = async (id) => {
    try {
        const result = await EmployeeEpf.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Employee EPF record not found");
        }
        return { success: true, message: "Employee EPF record deleted successfully" };
    } catch (err) {
        console.error("Error deleting Employee EPF record:", err);
        throw new Error(err.message || "Failed to delete Employee EPF record");
    }
}