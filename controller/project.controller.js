const Project = require('../model/project.model');
const { cloudinary } = require('../middlewares/upload.middleware');
const memoryCache = require('../utils/cache.util');

// Helper function to process and sanitize project input
const parseProjectBody = (body, req) => {
    const data = { ...body };

    // Detect uploaded file from req.file or req.files (supports 'image', 'img', 'file', 'photo', etc.)
    let uploadedFile = req?.file;
    if (!uploadedFile && Array.isArray(req?.files) && req.files.length > 0) {
        uploadedFile = req.files[0];
    } else if (!uploadedFile && req?.files && typeof req.files === 'object') {
        const fileKey = Object.keys(req.files)[0];
        if (fileKey && Array.isArray(req.files[fileKey]) && req.files[fileKey].length > 0) {
            uploadedFile = req.files[fileKey][0];
        }
    }

    // Handle Cloudinary uploaded file
    if (uploadedFile) {
        data.image = uploadedFile.path; // Cloudinary secure HTTPS URL
        data.cloudinaryPublicId = uploadedFile.filename; // Cloudinary public ID
    } else if (data.img && !data.image) {
        data.image = data.img;
    } else if (data.imageUrl && !data.image) {
        data.image = data.imageUrl;
    } else if (data.projectImage && !data.image) {
        data.image = data.projectImage;
    }



    // Git Link & GitHub URL compatibility
    if (data.githubUrl && !data.gitLink) {
        data.gitLink = data.githubUrl;
    }

    // Live Link & Live URL compatibility
    if (data.liveUrl && !data.liveLink) {
        data.liveLink = data.liveUrl;
    }

    // Parse technologies / tags if sent as string or JSON array
    let rawTech = data.technologies || data.tags;
    if (rawTech) {
        if (typeof rawTech === 'string') {
            try {
                const parsed = JSON.parse(rawTech);
                data.technologies = Array.isArray(parsed) ? parsed : [rawTech];
            } catch {
                // Comma-separated string format e.g. "React, Node.js, MongoDB"
                data.technologies = rawTech
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
        } else if (Array.isArray(rawTech)) {
            data.technologies = rawTech.map((t) => (typeof t === 'string' ? t.trim() : t));
        }
    }

    // Type casting for boolean & number fields from form-data
    if (typeof data.featured !== 'undefined') {
        data.featured = data.featured === true || data.featured === 'true';
    }

    if (typeof data.isActive !== 'undefined') {
        data.isActive = data.isActive === true || data.isActive === 'true';
    }

    if (typeof data.order !== 'undefined' && data.order !== '') {
        data.order = Number(data.order) || 0;
    }

    return data;
};

// Create a single project
exports.createProject = async (req, res) => {
    try {
        const projectData = parseProjectBody(req.body, req);

        const newProject = new Project(projectData);
        const savedProject = await newProject.save();
        memoryCache.invalidatePrefix('projects');

        return res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: savedProject,
        });
    } catch (error) {
        const uploadedFile = req?.file || (Array.isArray(req?.files) && req.files.length > 0 ? req.files[0] : null);
        if (uploadedFile?.filename) {
            await cloudinary.uploader.destroy(uploadedFile.filename).catch(() => { });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create project',
        });
    }
};

// Bulk create projects
exports.createBulkProjects = async (req, res) => {
    try {
        const projects = req.body;
        if (!Array.isArray(projects) || projects.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of projects',
            });
        }

        const savedProjects = await Project.insertMany(projects);
        memoryCache.invalidatePrefix('projects');

        return res.status(201).json({
            success: true,
            message: 'All projects created successfully',
            count: savedProjects.length,
            data: savedProjects,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create bulk projects',
        });
    }
};

// Get all projects (supports filters: category, featured, search, all)
exports.getAllProjects = async (req, res) => {
    try {
        const cacheKey = `projects_${JSON.stringify(req.query)}`;
        const cached = memoryCache.get(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        const { category, featured, search, all } = req.query;
        const filter = {};

        // By default, return active projects unless all=true is provided
        if (all !== 'true') {
            filter.isActive = true;
        }

        // Filter by category
        if (category) {
            filter.category = new RegExp(category, 'i');
        }

        // Filter by featured
        if (typeof featured !== 'undefined') {
            filter.featured = featured === 'true';
        }

        // Search in title, description, or technologies
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { shortDescription: searchRegex },
                { technologies: searchRegex },
            ];
        }

        const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean();

        const mapped = projects.map((p) => ({
            ...p,
            id: p._id.toString(),
            githubUrl: p.gitLink,
            liveUrl: p.liveLink,
            imageUrl: p.image,
            img: p.image,
        }));

        const responsePayload = {
            success: true,
            count: mapped.length,
            data: mapped,
        };

        memoryCache.set(cacheKey, responsePayload, 60);

        return res.status(200).json(responsePayload);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch projects',
        });
    }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch project',
        });
    }
};

// Get single project by Slug
exports.getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug, isActive: true });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch project',
        });
    }
};

// Update project by ID
exports.updateProject = async (req, res) => {
    try {
        const existingProject = await Project.findById(req.params.id);
        const uploadedFile = req?.file || (Array.isArray(req?.files) && req.files.length > 0 ? req.files[0] : null);

        if (!existingProject) {
            if (uploadedFile?.filename) {
                await cloudinary.uploader.destroy(uploadedFile.filename).catch(() => { });
            }
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        const updateData = parseProjectBody(req.body, req);

        // If new image was uploaded, remove old Cloudinary image
        if (uploadedFile && existingProject.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(existingProject.cloudinaryPublicId).catch(() => { });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        memoryCache.invalidatePrefix('projects');

        return res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: updatedProject,
        });
    } catch (error) {
        const uploadedFile = req?.file || (Array.isArray(req?.files) && req.files.length > 0 ? req.files[0] : null);
        if (uploadedFile?.filename) {
            await cloudinary.uploader.destroy(uploadedFile.filename).catch(() => { });
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update project',
        });
    }
};

// Delete project by ID
exports.deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        // Delete associated image from Cloudinary
        if (deletedProject.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(deletedProject.cloudinaryPublicId).catch(() => { });
        }

        memoryCache.invalidatePrefix('projects');

        return res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete project',
        });
    }
};



