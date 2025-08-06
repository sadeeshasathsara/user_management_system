import { createOrUpdateEmployeeEpf, deleteEmployeeEpfExpense, getEmployeeEpfs, getMaxEpf, updateMaxEpf } from "../services/epf.service.js";

export const updateMaxEpfController = async (req, res) => {
    try {
        const { maxEpf, ranges } = req.body;

        // Validate maxEpf
        if (typeof maxEpf !== 'number') {
            return res.status(400).json({ success: false, message: 'maxEpf must be a number.' });
        }

        if (maxEpf <= 0) {
            return res.status(400).json({ success: false, message: 'maxEpf must be greater than 0.' });
        }

        // Validate ranges if provided
        if (ranges && Array.isArray(ranges)) {
            for (const range of ranges) {
                if (!range.name || typeof range.name !== 'string' || range.name.trim() === '') {
                    return res.status(400).json({
                        success: false,
                        message: 'Each range must have a valid name.'
                    });
                }

                if (!range.maxValue || typeof range.maxValue !== 'string' || isNaN(parseInt(range.maxValue))) {
                    return res.status(400).json({
                        success: false,
                        message: 'Each range must have a valid maxValue.'
                    });
                }

                const rangeMaxValue = parseInt(range.maxValue);
                if (rangeMaxValue <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Range maxValue must be greater than 0.'
                    });
                }

                if (rangeMaxValue > maxEpf) {
                    return res.status(400).json({
                        success: false,
                        message: `Range "${range.name}" maxValue (${rangeMaxValue}) cannot exceed system maximum (${maxEpf}).`
                    });
                }
            }

            // Check for duplicate range names
            const rangeNames = ranges.map(r => r.name.toLowerCase().trim());
            const duplicateNames = rangeNames.filter((name, index) => rangeNames.indexOf(name) !== index);
            if (duplicateNames.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Range names must be unique.'
                });
            }

            // Sort ranges by maxValue and check for overlaps
            const sortedRanges = ranges.sort((a, b) => parseInt(a.maxValue) - parseInt(b.maxValue));
            for (let i = 0; i < sortedRanges.length - 1; i++) {
                if (parseInt(sortedRanges[i].maxValue) >= parseInt(sortedRanges[i + 1].maxValue)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Range values cannot overlap. Each range must have a unique maximum value.'
                    });
                }
            }
        }

        const updateData = { maxEpf };

        if (ranges && Array.isArray(ranges)) {
            if (ranges.length > 0) {
                updateData.ranges = ranges.map(range => ({
                    name: range.name.trim(),
                    description: range.description ? range.description.trim() : '',
                    maxValue: parseInt(range.maxValue),
                    icon: typeof range.icon === 'string' && range.icon.trim() !== '' ? range.icon.trim() : 'Users'
                }));
            } else {
                // Explicitly unset ranges when an empty array is sent
                updateData.ranges = [];
            }
        } else {
            // If `ranges` is not sent at all, clear it explicitly
            updateData.ranges = [];
        }


        const updated = await updateMaxEpf(updateData);

        res.status(200).json({
            success: true,
            message: 'EPF configuration updated successfully.',
            data: updated
        });
    } catch (err) {
        console.error('Error updating EPF configuration:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update EPF configuration.',
            error: err.message || err
        });
    }
};

export const getMaxEpfController = async (req, res) => {
    try {
        const epfConfig = await getMaxEpf();
        if (!epfConfig) {
            return res.status(404).json({
                success: false,
                message: 'EPF configuration not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                maxEpf: epfConfig.maxEpf,
                ranges: epfConfig.ranges || []
            }
        });
    } catch (err) {
        console.error('Error fetching EPF configuration:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch EPF configuration.',
            error: err.message || err
        });
    }
};

export const getEmployeeEpfsController = async (req, res) => {
    try {
        const { user_id, year } = req.query;
        const query = {};

        if (user_id) {
            if (!/^[a-f\d]{24}$/i.test(user_id)) {
                return res.status(400).json({ success: false, message: "Invalid user ID format." });
            }
            query.user = user_id;
        }

        if (year) {
            const parsedYear = parseInt(year);
            if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
                return res.status(400).json({ success: false, message: "Invalid year provided." });
            }
            query.year = parsedYear;
        }

        const { success, data, message, error } = await getEmployeeEpfs(query);

        if (!success) {
            return res.status(500).json({
                success: false,
                message: message || "Failed to fetch Employee EPF records.",
                error
            });
        }

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.error("Controller error fetching Employee EPF records:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message || err
        });
    }
};

export const createOrUpdateEmployeeEpfController = async (req, res) => {
    try {
        const { user, year, rangeExpenses, regularExpenses, method } = req.body;

        if (!user || !year || !Array.isArray(rangeExpenses) || !Array.isArray(regularExpenses)) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: user, year, rangeExpenses, or regularExpenses"
            });
        }

        if (!/^[a-f\d]{24}$/i.test(user)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const parsedYear = new Date(year);
        if (isNaN(parsedYear)) {
            return res.status(400).json({ success: false, message: "Invalid year date format" });
        }

        const updated = await createOrUpdateEmployeeEpf({
            user,
            year: parsedYear,
            rangeExpenses,
            regularExpenses,
            method
        });

        return res.status(200).json({
            success: true,
            message: "Employee EPF record created or updated successfully",
            data: updated
        });
    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message || err
        });
    }
};


export const deleteEmployeeEpfExpenseController = async (req, res) => {
    try {
        const { epfId } = req.params;
        const { type, createdAt, rangeName } = req.body;

        if (!epfId || !/^[a-f\d]{24}$/i.test(epfId)) {
            return res.status(400).json({ success: false, message: "Invalid EPF ID" });
        }

        if (!createdAt || isNaN(Date.parse(createdAt))) {
            return res.status(400).json({ success: false, message: "Invalid or missing createdAt timestamp" });
        }

        if (type === "range" && !rangeName) {
            return res.status(400).json({ success: false, message: "Range name is required for range expense deletion" });
        }

        const result = await deleteEmployeeEpfExpense({ epfId, type, createdAt, rangeName });

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message || err
        });
    }
};
