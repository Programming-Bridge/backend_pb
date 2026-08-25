const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email address is required'],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        roleApplied: {
            type: String,
            required: [true, 'Position / Role applied for is required'],
            trim: true,
        },
        experienceYears: {
            type: String,
            default: '3+ Years',
            trim: true,
        },
        portfolioUrl: {
            type: String,
            trim: true,
            default: '',
        },
        githubUrl: {
            type: String,
            trim: true,
            default: '',
        },
        linkedinUrl: {
            type: String,
            trim: true,
            default: '',
        },
        resumeUrl: {
            type: String,
            trim: true,
            default: '',
        },
        coverLetter: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['Pending', 'Reviewed', 'Interview Scheduled', 'Rejected', 'Accepted'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Application', applicationSchema);
