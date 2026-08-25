const ServiceCard = require('../model/serviceCard.model');
const memoryCache = require('../utils/cache.util');

// Get All Active Service Cards (supports filters: category, search, all)
exports.getAllServiceCards = async (req, res) => {
    try {
        const cacheKey = `services_${JSON.stringify(req.query)}`;
        const cached = memoryCache.get(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        const { category, search, all } = req.query;
        const filter = {};

        if (all !== 'true') {
            filter.isActive = true;
        }

        if (category) {
            const catRegex = new RegExp(category, 'i');
            filter.$or = [
                { title: catRegex },
                { tags: catRegex },
                { description: catRegex },
            ];
        }

        if (search) {
            const sRegex = new RegExp(search, 'i');
            filter.$or = [
                { title: sRegex },
                { description: sRegex },
                { tags: sRegex },
            ];
        }

        const cards = await ServiceCard.find(filter).sort({ order: 1 }).lean();
        const responsePayload = { success: true, count: cards.length, data: cards };

        memoryCache.set(cacheKey, responsePayload, 120);

        return res.status(200).json(responsePayload);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Create Single Service Card
exports.createServiceCard = async (req, res) => {
    try {
        const newCard = new ServiceCard(req.body);
        const savedCard = await newCard.save();
        memoryCache.invalidatePrefix('services');
        return res.status(201).json({
            success: true,
            message: 'Service card created successfully',
            data: savedCard,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Bulk Create Service Cards
exports.createBulkServiceCards = async (req, res) => {
    try {
        const cards = req.body;
        if (!Array.isArray(cards) || cards.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide an array of service cards' });
        }
        const savedCards = await ServiceCard.insertMany(cards);
        memoryCache.invalidatePrefix('services');
        return res.status(201).json({
            success: true,
            message: 'All service cards created successfully',
            count: savedCards.length,
            data: savedCards,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update Single Service Card
exports.updateServiceCard = async (req, res) => {
    try {
        const updatedCard = await ServiceCard.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCard) {
            return res.status(404).json({ success: false, message: 'Service card not found' });
        }
        memoryCache.invalidatePrefix('services');
        return res.status(200).json({
            success: true,
            message: 'Service card updated successfully',
            data: updatedCard,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Single Service Card
exports.deleteServiceCard = async (req, res) => {
    try {
        const deletedCard = await ServiceCard.findByIdAndDelete(req.params.id);
        if (!deletedCard) {
            return res.status(404).json({ success: false, message: 'Service card not found' });
        }
        memoryCache.invalidatePrefix('services');
        return res.status(200).json({ success: true, message: 'Service card deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};