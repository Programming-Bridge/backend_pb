const mongoose = require('mongoose');

const serviceCardSchema = new mongoose.Schema(
    {
        icon: {
            type: String,
            default: 'LineChart', // e.g. Lucide icon name
            trim: true,
        },
        badge: {
            type: String, // e.g. "MOST POPULAR"
            trim: true,
            default: '',
        },
        title: {
            type: String,
            required: [true, 'Service title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Service description is required'],
            trim: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        link: {
            type: String,
            default: '/services',
            trim: true,
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
    { timestamps: true }
);

// Performance Indexes for ultra-fast query lookups
serviceCardSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('ServiceCard', serviceCardSchema);