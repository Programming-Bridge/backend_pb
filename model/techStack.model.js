const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Technology name is required'],
            trim: true,
        },
        svgUrl: {
            type: String,
            required: [true, 'SVG / Logo URL is required'],
            trim: true,
        },
        domain: {
            type: String,
            enum: ['software', 'ai-ml', 'mobile'],
            default: 'software',
            trim: true,
        },
        category: {
            type: String,
            default: 'general',
            trim: true,
        },
        categoryLabel: {
            type: String,
            default: '',
            trim: true,
        },
        badge: {
            type: String,
            default: '',
            trim: true,
        },
        shortDesc: {
            type: String,
            default: '',
            trim: true,
        },
        highlight: {
            type: String,
            default: '',
            trim: true,
        },
        invertInDark: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Performance Indexes
techStackSchema.index({ domain: 1, isActive: 1, order: 1 });
techStackSchema.index({ isActive: 1, order: 1 });
techStackSchema.index({ id: 1 });

// Virtual alias for slug or id
techStackSchema.virtual('techId')
    .get(function () {
        return this.id || this._id?.toString();
    });

const TechStack = mongoose.model('TechStack', techStackSchema);
module.exports = TechStack;
