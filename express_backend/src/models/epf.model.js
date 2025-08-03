import mongoose from "mongoose";

// Sub-schema for EPF ranges
const epfRangeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    maxValue: {
        type: Number,
        required: true,
        min: 1
    },
    icon: {
        type: String,
        default: 'Users',
        trim: true
    }
}, { _id: false }); // Disable _id for subdocuments

const epfSchema = new mongoose.Schema({
    maxEpf: {
        type: Number,
        required: true,
        min: 1
    },
    ranges: {
        type: [epfRangeSchema],
        default: [],
        validate: {
            validator: function (ranges) {
                if (!ranges || ranges.length === 0) return true;

                // Check for duplicate names
                const names = ranges.map(r => r.name.toLowerCase());
                const uniqueNames = [...new Set(names)];
                if (names.length !== uniqueNames.length) {
                    return false;
                }

                // Check for duplicate maxValues
                const maxValues = ranges.map(r => r.maxValue);
                const uniqueMaxValues = [...new Set(maxValues)];
                if (maxValues.length !== uniqueMaxValues.length) {
                    return false;
                }

                // Check that all range maxValues are less than or equal to system maxEpf
                const maxEpf = this.maxEpf;
                return ranges.every(range => range.maxValue <= maxEpf);
            },
            message: 'Invalid ranges: Check for duplicates and ensure all ranges are within system maximum'
        }
    }
}, {
    timestamps: true,
    // Add indexes for better performance
    indexes: [
        { maxEpf: 1 },
        { 'ranges.name': 1 },
        { 'ranges.maxValue': 1 }
    ]
});

// Pre-save middleware to sort ranges by maxValue
epfSchema.pre('save', function (next) {
    if (this.ranges && this.ranges.length > 0) {
        this.ranges.sort((a, b) => a.maxValue - b.maxValue);
    }
    next();
});

// Pre-update middleware for findOneAndUpdate
epfSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.ranges && Array.isArray(update.ranges) && update.ranges.length > 0) {
        update.ranges.sort((a, b) => a.maxValue - b.maxValue);
    }
    next();
});

// Instance method to find range for a given EPF number
epfSchema.methods.findRangeForEpfNumber = function (epfNumber) {
    if (!this.ranges || this.ranges.length === 0) {
        return null;
    }

    // Ranges are already sorted by maxValue
    for (const range of this.ranges) {
        if (epfNumber <= range.maxValue) {
            return range;
        }
    }

    return null; // EPF number is above all ranges
};

// Static method to get EPF configuration with validation
epfSchema.statics.getConfigWithValidation = async function () {
    const config = await this.findOne({});
    if (!config) {
        return null;
    }

    return {
        maxEpf: config.maxEpf,
        ranges: config.ranges || [],
        validateEpfNumber: (epfNumber) => {
            if (epfNumber > config.maxEpf) {
                return {
                    valid: false,
                    message: `EPF number exceeds maximum allowed value of ${config.maxEpf}`
                };
            }

            const range = config.findRangeForEpfNumber(epfNumber);
            return {
                valid: true,
                range: range ? range.name : 'Unassigned',
                message: range ? `Belongs to ${range.name}` : 'Within system limit but no specific range'
            };
        }
    };
};

const EPF = mongoose.model("EPF", epfSchema);
export default EPF;