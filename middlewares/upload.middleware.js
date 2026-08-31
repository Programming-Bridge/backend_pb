require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to sanitize filename
const sanitizeFilename = (originalname) => {
    if (!originalname) return `file-${Date.now()}`;
    const base = originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
    return `${base || 'image'}-${Date.now()}`;
};

// Storage setup for Projects (Cloudinary)
const projectStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'programming_bridge/projects',
            resource_type: 'auto',
            public_id: sanitizeFilename(file.originalname),
        };
    },
});

// Storage setup for Banners (Cloudinary)
const bannerStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'programming_bridge/banners',
            resource_type: 'auto',
            public_id: sanitizeFilename(file.originalname),
        };
    },
});

// Storage setup for Resumes (Cloudinary)
const resumeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'programming_bridge/resumes',
            resource_type: 'auto',
            public_id: sanitizeFilename(file.originalname),
        };
    },
});

// Multer upload instances
const uploadProject = multer({
    storage: projectStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const uploadBanner = multer({
    storage: bannerStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
});

module.exports = {
    cloudinary,
    upload: uploadProject,
    uploadProject,
    uploadBanner,
    uploadResume,
};