import mongoose from 'mongoose';

const employee = new mongoose.Schema({
    epfNumber: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String
    },
    dateOfBirth: {
        type: Date,
    },
    nicNumber: {
        type: String,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    joinedDate: {
        type: Date,
    },
    basicSalary: {
        type: Number,
    },
    employmentType: {
        type: String,
        enum: ['Permanent', 'Contract', 'Intern'],
    },
    profilePicture: {
        type: String,
    },
    maritalStatus: {
        type: String,
        enum: ['Unmarried', 'Married'],
        default: 'Unmarried',
    },
    spouseName: {
        type: String,
        required: function () {
            return this.maritalStatus === 'Married';
        },
    },
    parents: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                relationship: {
                    type: String,
                    enum: ['Father', 'Mother', 'Guardian'],
                    required: true
                },
                contactNumber: {
                    type: String,
                    required: true
                }
            }
        ],
        required: function () {
            return this.maritalStatus === 'Unmarried';
        }
    },
    children: [
        {
            name: String,
            dateOfBirth: Date,
            gender: {
                type: String,
                enum: ['Male', 'Female', 'Other']
            },
            school: String,
            grade: String,
        }
    ],
    contactNumber: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Employee = mongoose.model('User', employeeSchema);
export default Employee;
