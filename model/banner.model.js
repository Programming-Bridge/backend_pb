const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        pageType: {
            type: String,
            required: [true, 'Page type is required'],
            trim: true,
            unique: true,
        },
        badge: {
            type: String,
            trim: true,
            default: '',
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        subTitle: {
            type: String,
            trim: true,
            default: '',
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        // Primary CTA Button
        primaryBtnText: {
            type: String,
            trim: true,
            default: 'Get Started',
        },
        primaryBtnLink: {
            type: String,
            trim: true,
            default: '/contact',
        },
        // Secondary CTA Button
        secondaryBtnText: {
            type: String,
            trim: true,
            default: 'View Portfolio',
        },
        secondaryBtnLink: {
            type: String,
            trim: true,
            default: '/portfolio',
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
        imageAlt: {
            type: String,
            trim: true,
            default: '',
        },
        features: [
            {
                type: String,
                trim: true,
            },
        ],
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

// Virtual aliases for banner images
bannerSchema.virtual('img')
    .get(function () {
        return this.image;
    })
    .set(function (val) {
        this.image = val;
    });

bannerSchema.virtual('imageUrl')
    .get(function () {
        return this.image;
    })
    .set(function (val) {
        this.image = val;
    });

const bannerModel = mongoose.model('Banner', bannerSchema);
module.exports = bannerModel;
