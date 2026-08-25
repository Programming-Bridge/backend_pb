const bannerModel = require('../model/banner.model');
const { cloudinary } = require('../middlewares/upload.middleware');

// Helper function to process and sanitize banner input
const parseBannerBody = (body, req) => {
    const data = { ...body };

    // Detect uploaded file from req.file or req.files (supports 'image', 'img', 'bannerImage', 'file', etc.)
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
    } else if (data.bannerImage && !data.image) {
        data.image = data.bannerImage;
    }

    // Parse features if sent as string or JSON array from form-data
    if (data.features) {
        if (typeof data.features === 'string') {
            try {
                const parsed = JSON.parse(data.features);
                data.features = Array.isArray(parsed) ? parsed : [data.features];
            } catch {
                data.features = data.features
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
        } else if (Array.isArray(data.features)) {
            data.features = data.features.map((f) => (typeof f === 'string' ? f.trim() : f));
        }
    }

    // Type casting for boolean & number fields from form-data
    if (typeof data.isActive !== 'undefined') {
        data.isActive = data.isActive === true || data.isActive === 'true';
    }

    if (typeof data.order !== 'undefined' && data.order !== '') {
        data.order = Number(data.order) || 0;
    }

    return data;
};

// Create Banner
exports.createBanner = async (req, res) => {
    try {
        const bannerData = parseBannerBody(req.body, req);
        const { pageType } = bannerData;

        const existingBanner = await bannerModel.findOne({ pageType });
        if (existingBanner) {
            const uploadedFile = req?.file || (Array.isArray(req?.files) && req.files.length > 0 ? req.files[0] : null);
            if (uploadedFile?.filename) {
                await cloudinary.uploader.destroy(uploadedFile.filename).catch(() => {});
            }
            return res.status(400).json({
                success: false,
                message: `Banner for ${pageType} already exists`,
            });
        }

        const newBanner = new bannerModel(bannerData);
        const savedBanner = await newBanner.save();

        return res.status(201).json({
            success: true,
            message: 'Banner created successfully',
            data: savedBanner,
        });
    } catch (error) {
        const uploadedFile = req?.file || (Array.isArray(req?.files) && req.files.length > 0 ? req.files[0] : null);
        if (uploadedFile?.filename) {
            await cloudinary.uploader.destroy(uploadedFile.filename).catch(() => {});
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Banners
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await bannerModel.find().sort({ order: 1, createdAt: -1 });
        return res.status(200).json({ success: true, count: banners.length, data: banners });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get Banner by Page Type
exports.getBannerByPageType = async (req, res) => {
    try {
        const banner = await bannerModel.findOne({ pageType: req.params.pageType, isActive: true });
        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }
        return res.status(200).json({ success: true, data: banner });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update Banner
exports.updateBanner = async (req, res) => {
    try {
        const existingBanner = await bannerModel.findById(req.params.id);
        const uploadedFile = req?.file || (Array.isArray(req?.files) && req.files.length > 0 ? req.files[0] : null);

        if (!existingBanner) {
            if (uploadedFile?.filename) {
                await cloudinary.uploader.destroy(uploadedFile.filename).catch(() => {});
            }
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        const updateData = parseBannerBody(req.body, req);

        // Delete old Cloudinary image if new file uploaded
        if (uploadedFile && existingBanner.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(existingBanner.cloudinaryPublicId).catch(() => {});
        }

        const updatedBanner = await bannerModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Banner updated successfully',
            data: updatedBanner,
        });
    } catch (error) {
        const uploadedFile = req?.file || (Array.isArray(req?.files) && req.files.length > 0 ? req.files[0] : null);
        if (uploadedFile?.filename) {
            await cloudinary.uploader.destroy(uploadedFile.filename).catch(() => {});
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
    try {
        const deletedBanner = await bannerModel.findByIdAndDelete(req.params.id);
        if (!deletedBanner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        // Delete associated image from Cloudinary
        if (deletedBanner.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(deletedBanner.cloudinaryPublicId).catch(() => {});
        }

        return res.status(200).json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

