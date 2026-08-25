const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address',
            ],
        },
        projectType: {
            type: String,
            required: [true, 'Project type is required'],
            trim: true,
            default: 'Web Development',
        },
        budgetRange: {
            type: String,
            trim: true,
            default: 'Not Specified',
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        company: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['New', 'In Review', 'Contacted', 'Closed'],
            default: 'New',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual aliases for frontend flexibility
inquirySchema.virtual('fullName')
    .get(function () {
        return this.name;
    })
    .set(function (val) {
        this.name = val;
    });

inquirySchema.virtual('budget')
    .get(function () {
        return this.budgetRange;
    })
    .set(function (val) {
        this.budgetRange = val;
    });

inquirySchema.virtual('serviceType')
    .get(function () {
        return this.projectType;
    })
    .set(function (val) {
        this.projectType = val;
    });

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
