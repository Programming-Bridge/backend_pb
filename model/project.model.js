const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Project description is required'],
            trim: true,
        },
        shortDescription: {
            type: String,
            trim: true,
            default: '',
        },
        category: {
            type: String,
            trim: true,
            default: 'Web Development',
        },
        badge: {
            type: String,
            trim: true,
            default: '',
        },
        image: {
            type: String,
            trim: true,
            default: '',
        },
        cloudinaryPublicId: {
            type: String,
            trim: true,
            default: '',
        },
        gitLink: {
            type: String,
            trim: true,
            default: '',
        },
        liveLink: {
            type: String,
            trim: true,
            default: '',
        },
        technologies: [
            {
                type: String,
                trim: true,
            },
        ],
        client: {
            type: String,
            trim: true,
            default: '',
        },
        featured: {
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

// Performance Indexes for ultra-fast query lookups
projectSchema.index({ isActive: 1, order: 1 });
projectSchema.index({ category: 1, isActive: 1 });
projectSchema.index({ featured: 1, isActive: 1 });
projectSchema.index({ slug: 1 });

// Virtual aliases for ease of use
projectSchema.virtual('githubUrl')
    .get(function () {
        return this.gitLink;
    })
    .set(function (val) {
        this.gitLink = val;
    });

projectSchema.virtual('liveUrl')
    .get(function () {
        return this.liveLink;
    })
    .set(function (val) {
        this.liveLink = val;
    });

projectSchema.virtual('img')
    .get(function () {
        return this.image;
    })
    .set(function (val) {
        this.image = val;
    });

projectSchema.virtual('imageUrl')
    .get(function () {
        return this.image;
    })
    .set(function (val) {
        this.image = val;
    });

// Pre-save hook to generate slug if not provided
projectSchema.pre('save', function () {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
