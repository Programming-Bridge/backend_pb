const ServiceSlide = require('../model/serviceSlide.model');

exports.getAllSlides = async (req, res) => {
    try {
        const slides = await ServiceSlide.find({ isActive: true }).sort({ order: 1 });
        return res.status(200).json({ success: true, count: slides.length, data: slides });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.createSlide = async (req, res) => {
    try {
        const newSlide = new ServiceSlide(req.body);
        const savedSlide = await newSlide.save();
        return res.status(201).json({
            success: true,
            message: 'Slide created successfully',
            data: savedSlide,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSlide = async (req, res) => {
    try {
        const updatedSlide = await ServiceSlide.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSlide) {
            return res.status(404).json({ success: false, message: 'Slide not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Slide updated successfully',
            data: updatedSlide,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSlide = async (req, res) => {
    try {
        const deletedSlide = await ServiceSlide.findByIdAndDelete(req.params.id);
        if (!deletedSlide) {
            return res.status(404).json({ success: false, message: 'Slide not found' });
        }
        return res.status(200).json({ success: true, message: 'Slide deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};