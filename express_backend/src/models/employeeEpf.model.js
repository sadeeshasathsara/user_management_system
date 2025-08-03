import mongoose from "mongoose";

// Sub-schema for individual expense entries
const individualExpenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    expensedAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
}, { _id: false });

const rangeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    expenses: {
        type: [individualExpenseSchema],
        default: [],
    },
}, { _id: false });

const employeeEpfSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    year: {
        type: Date,
        required: true,
    },
    rangeExpenses: {
        type: [rangeSchema],
        default: [],
        validate: {
            validator: function (rangeExpenses) {
                if (!rangeExpenses || rangeExpenses.length === 0) return true;
                const names = rangeExpenses.map(r => r.name.toLowerCase());
                return names.length === new Set(names).size;
            },
            message: "Each range expense must have a unique range name.",
        },
    },
    regularExpenses: {
        type: [individualExpenseSchema],
        default: [],
    },
}, { timestamps: true });

const EmployeeEpf = mongoose.model("EmployeeEpf", employeeEpfSchema);
export default EmployeeEpf;
