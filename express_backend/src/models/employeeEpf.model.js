import mongoose from "mongoose";

const employeeEpfSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expense: {
        type: Number,
        required: true
    },
    year: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const EmployeeEpf = mongoose.model("UserEpf", employeeEpfSchema);
export default EmployeeEpf