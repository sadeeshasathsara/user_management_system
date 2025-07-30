import mongoose from "mongoose";

const epfSchema = new mongoose.Schema({
    maxEpf: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const EPF = mongoose.model("EPF", epfSchema);
export default EPF;
