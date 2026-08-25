const mongoose = require('mongoose');

const serviceSlideSchema = new mongoose.Schema(
    {
        slideNumber: {
            type: String, // e.g., "01 / SLIDE" ya "01"
            required: [true, 'Slide number is required'],
            trim: true,
        },
        title: {
            type: String, // e.g., "MERN & Web Apps"
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String, // e.g., "Enterprise-grade web systems"
            required: [true, 'Description is required'],
            trim: true,
        },
        icon: {
            type: String, // e.g., "database", "smartphone", "chart-line" (Lucide/React-Icons name)
            default: 'code',
            trim: true,
        },
        link: {
            type: String, // e.g., "/services/web-development"
            trim: true,
            default: '',
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

const serviceModel = mongoose.model('ServiceSlide', serviceSlideSchema);
module.exports = serviceModel