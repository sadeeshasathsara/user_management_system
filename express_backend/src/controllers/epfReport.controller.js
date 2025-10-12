// controllers/epfReport.controller.js
import { generateEmployeeEpfReport } from '../services/generateEmployeeEpfReport.service.js';

/**
 * @desc Generate and return an Employee EPF Report (PDF)
 * @route GET /api/reports/epf/:employeeId/:year
 * @access Private (or adjust based on your auth setup)
 */
export const getEmployeeEpfReportController = async (req, res) => {
    try {
        const { employeeId, year } = req.params;

        if (!employeeId || !year) {
            return res.status(400).json({
                success: false,
                message: "Employee ID and Year are required.",
            });
        }

        const pdfBuffer = await generateEmployeeEpfReport(employeeId, year);

        // ✅ Proper headers to trigger download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=epf_report_${employeeId}_${year}.pdf`
        );

        // ✅ End response with binary data
        res.end(pdfBuffer);
    } catch (error) {
        console.error("EPF report generation failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate EPF report.",
            error: error.message,
        });
    }
};  