const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            trim: true,
            enum: [
                'Full-Stack & Web',
                'Mobile Engineering',
                'AI & Data Science',
                'Cloud & DevOps',
                'UI/UX & Product Design',
                'Engineering',
                'Operations',
            ],
            default: 'Full-Stack & Web',
        },
        location: {
            type: String,
            default: 'Remote / Global',
            trim: true,
        },
        type: {
            type: String,
            enum: ['Full-Time', 'Part-Time', 'Contract', 'Remote'],
            default: 'Full-Time',
        },
        experience: {
            type: String,
            default: '3+ Years',
            trim: true,
        },
        salaryRange: {
            type: String,
            default: 'Competitive / Market Leading',
            trim: true,
        },
        badge: {
            type: String,
            default: 'HOT OPENING',
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
            trim: true,
        },
        responsibilities: {
            type: [String],
            default: [],
        },
        requirements: {
            type: [String],
            default: [],
        },
        skills: {
            type: [String],
            default: [],
        },
        benefits: {
            type: [String],
            default: [
                '100% Remote flexibility',
                'Health & Wellness allowance',
                'Annual equipment budget',
                'Continuous learning & conference passes',
            ],
        },
        order: {
            type: Number,
            default: 0,
        },
        isOpen: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate slug before save if not provided
careerSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    next();
});

module.exports = mongoose.model('Career', careerSchema);
