const navbarModel = require('../model/navbar.model');

exports.getNavItems = async (req, res) => {
    try {
        const navItems = await navbarModel.find({ isActive: true }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: navItems.length,
            data: navItems
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createNavItem = async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const items = await navbarModel.insertMany(req.body);
            return res.status(201).json({ success: true, data: items });
        }

        const navItem = await navbarModel.create(req.body);
        res.status(201).json({ success: true, data: navItem });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateNavItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await navbarModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Nav Item not found" });
        }

        res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteNavItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await navbarModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Nav Item not found" });
        }

        res.status(200).json({ success: true, message: "Nav Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};