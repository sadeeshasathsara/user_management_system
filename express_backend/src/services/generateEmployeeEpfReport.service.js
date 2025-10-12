import Employee from "../models/employee.model.js";
import EmployeeEpf from "../models/employeeEpf.model.js";
import EPF from "../models/epf.model.js";
import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import { log } from "console";
import fs from "fs";

export async function generateEmployeeEpfReport(employeeId, year) {
    try {
        // 1️⃣ Get employee data
        const employee = await Employee.findById(employeeId).populate("department");
        if (!employee) throw new Error("Employee not found");

        // 2️⃣ Get EPF configuration
        const epfConfig = await EPF.findOne({});
        if (!epfConfig) throw new Error("EPF configuration not found");

        // 3️⃣ Get employee EPF data for that year
        const employeeEpf = await EmployeeEpf.findOne({
            user: employeeId,
            year: new Date(year),
        });
        if (!employeeEpf)
            throw new Error(`No EPF data found for ${employee.name} in ${year}`);

        // 4️⃣ Prepare detailed range summaries (with date + amount per expense)
        const rangeSummaries = employeeEpf.rangeExpenses.map((range) => {
            const totalAmount = range.expenses.reduce((sum, e) => sum + e.amount, 0);

            const expenseDetails = range.expenses.map((e) => ({
                date: new Date(e.expensedAt).toLocaleDateString(),
                amount: e.amount,
            }));

            return {
                name: range.name,
                totalAmount,
                count: range.expenses.length, // times used
                expenseDetails,
            };
        });

        // 5️⃣ Regular EPF totals and details
        const regularExpenses = employeeEpf.regularExpenses.map((e) => ({
            date: new Date(e.expensedAt).toLocaleDateString(),
            amount: e.amount,
        }));

        const regularTotal = regularExpenses.reduce((sum, e) => sum + e.amount, 0);
        const regularCount = regularExpenses.length; // times used

        // 6️⃣ Total Expenses
        const rangeTotal = rangeSummaries.reduce((sum, r) => sum + r.totalAmount, 0);
        const totalUsed = rangeTotal + regularTotal;
        const totalExpenses = totalUsed;

        // 7️⃣ Medical Usage Overview
        // Assuming epfConfig.maxEpf is the total yearly limit
        const medicalUsed = totalUsed;
        const medicalRemaining = epfConfig.maxEpf - medicalUsed;
        const medicalLimit = epfConfig.maxEpf;

        const logoBase64 = fs.readFileSync(
            path.join(process.cwd(), "src", "assets", "logo.png")
        ).toString("base64");
        const logoDataUri = `data:image/png;base64,${logoBase64}`;

        // 8️⃣ Render EJS to HTML
        const html = await ejs.renderFile(
            path.join(process.cwd(), "src", "views", "epfReportTemplate.view.ejs"),
            {
                logoDataUri,
                employee,
                year,
                rangeSummaries,
                regularTotal,
                regularCount,
                regularExpenses,
                totalUsed,
                totalExpenses,
                medicalUsed,
                medicalRemaining,
                medicalLimit,
                epfConfig,
                generatedAt: new Date().toLocaleString(),
            }
        );

        // 9️⃣ Generate PDF using Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "30mm", bottom: "20mm" },
        });

        await browser.close();
        return pdfBuffer;
    } catch (err) {
        console.error("EPF report generation failed:", err.message);
        throw err;
    }
}
