const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Team member name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role / Designation is required'],
            trim: true,
        },
        department: {
            type: String,
            enum: ['Web & Cloud', 'Mobile Engineering', 'AI & Data', 'DevOps & Security', 'Management', 'General'],
            default: 'Web & Cloud',
            trim: true,
        },
        bio: {
            type: String,
            default: '',
            trim: true,
        },
        avatar: {
            type: String,
            default: '',
            trim: true,
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        experience: {
            type: String,
            default: '5+ Years',
            trim: true,
        },
        socialLinks: {
            github: { type: String, default: '', trim: true },
            linkedin: { type: String, default: '', trim: true },
            twitter: { type: String, default: '', trim: true },
            email: { type: String, default: '', trim: true },
        },
        order: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Performance Indexes
teamSchema.index({ department: 1, isActive: 1, order: 1 });
teamSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Team', teamSchema);
