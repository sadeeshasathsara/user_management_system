import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    validatedAt: {
        type: Date, // ✅ New field
        default: null
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 60 * 60 * 1000),
        index: { expires: 0 }
    }
}, { timestamps: true });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
