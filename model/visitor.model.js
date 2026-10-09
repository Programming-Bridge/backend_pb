const mongoose = require('mongoose');

const visitHistorySchema = new mongoose.Schema(
    {
        path: {
            type: String,
            default: '/',
            trim: true,
        },
        referrer: {
            type: String,
            default: 'Direct',
            trim: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        ip: {
            type: String,
            default: '',
        },
    },
    { _id: false }
);

const visitorSchema = new mongoose.Schema(
    {
        ip: {
            type: String,
            required: [true, 'IP address is required'],
            index: true,
            trim: true,
        },
        visitorId: {
            type: String,
            index: true,
            trim: true,
            default: '',
        },
        country: {
            type: String,
            default: 'Unknown',
            trim: true,
        },
        countryCode: {
            type: String,
            default: 'UN',
            uppercase: true,
            trim: true,
        },
        city: {
            type: String,
            default: 'Unknown',
            trim: true,
        },
        region: {
            type: String,
            default: 'Unknown',
            trim: true,
        },
        timezone: {
            type: String,
            default: 'UTC',
            trim: true,
        },
        isp: {
            type: String,
            default: '',
            trim: true,
        },
        userAgent: {
            type: String,
            default: '',
            trim: true,
        },
        browser: {
            type: String,
            default: 'Unknown Browser',
            trim: true,
        },
        os: {
            type: String,
            default: 'Unknown OS',
            trim: true,
        },
        device: {
            type: String,
            enum: ['Desktop', 'Mobile', 'Tablet', 'Bot', 'Unknown'],
            default: 'Desktop',
        },
        screenResolution: {
            type: String,
            default: '',
            trim: true,
        },
        language: {
            type: String,
            default: 'en',
            trim: true,
        },
        lastPath: {
            type: String,
            default: '/',
            trim: true,
        },
        lastReferrer: {
            type: String,
            default: 'Direct',
            trim: true,
        },
        totalVisits: {
            type: Number,
            default: 1,
            min: 1,
        },
        firstVisitAt: {
            type: Date,
            default: Date.now,
        },
        lastVisitAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        visitsHistory: {
            type: [visitHistorySchema],
            default: [],
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        notes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound indexes for fast querying in admin dashboard
visitorSchema.index({ ip: 1, lastVisitAt: -1 });
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ country: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
