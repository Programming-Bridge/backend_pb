const Visitor = require('../model/visitor.model');
const {
    extractClientIp,
    parseUserAgent,
    resolveGeoLocation,
} = require('../utils/geoIp.util');

/**
 * Public Endpoint: Track a page visit
 * POST /api/visitors/track
 */
exports.trackVisitor = async (req, res) => {
    try {
        const clientIp = extractClientIp(req);
        const userAgentString = req.headers['user-agent'] || '';
        const { device, browser, os } = parseUserAgent(userAgentString);

        const {
            path = '/',
            referrer = 'Direct',
            visitorId = '',
            screenResolution = '',
            language = req.headers['accept-language']?.split(',')[0] || 'en',
        } = req.body || {};

        // Resolve GeoIP location
        const geoInfo = await resolveGeoLocation(clientIp, req);

        const now = new Date();
        const visitEntry = {
            path: (path || '/').substring(0, 500),
            referrer: (referrer || 'Direct').substring(0, 500),
            timestamp: now,
            ip: clientIp,
        };

        // Query criteria: match by IP or visitorId if available
        let query = { ip: clientIp };
        if (visitorId) {
            query = { $or: [{ visitorId }, { ip: clientIp }] };
        }

        let visitor = await Visitor.findOne(query);

        if (visitor) {
            // Update existing visitor
            visitor.totalVisits = (visitor.totalVisits || 1) + 1;
            visitor.lastVisitAt = now;
            visitor.lastPath = visitEntry.path;
            visitor.lastReferrer = visitEntry.referrer;
            visitor.browser = browser !== 'Unknown Browser' ? browser : visitor.browser;
            visitor.os = os !== 'Unknown OS' ? os : visitor.os;
            visitor.device = device;
            visitor.userAgent = userAgentString;
            if (visitorId && !visitor.visitorId) {
                visitor.visitorId = visitorId;
            }
            if (screenResolution) {
                visitor.screenResolution = screenResolution;
            }
            if (language) {
                visitor.language = language;
            }
            if (geoInfo.country !== 'Unknown' && (visitor.country === 'Unknown' || !visitor.country)) {
                visitor.country = geoInfo.country;
                visitor.countryCode = geoInfo.countryCode;
                visitor.city = geoInfo.city;
                visitor.region = geoInfo.region;
                visitor.timezone = geoInfo.timezone;
                visitor.isp = geoInfo.isp;
            }

            // Cap history at last 50 visits to conserve DB space
            if (!Array.isArray(visitor.visitsHistory)) {
                visitor.visitsHistory = [];
            }
            visitor.visitsHistory.unshift(visitEntry);
            if (visitor.visitsHistory.length > 50) {
                visitor.visitsHistory = visitor.visitsHistory.slice(0, 50);
            }

            await visitor.save();
        } else {
            // Create new visitor
            visitor = new Visitor({
                ip: clientIp,
                visitorId: visitorId || '',
                country: geoInfo.country,
                countryCode: geoInfo.countryCode,
                city: geoInfo.city,
                region: geoInfo.region,
                timezone: geoInfo.timezone,
                isp: geoInfo.isp,
                userAgent: userAgentString,
                browser,
                os,
                device,
                screenResolution,
                language,
                lastPath: visitEntry.path,
                lastReferrer: visitEntry.referrer,
                totalVisits: 1,
                firstVisitAt: now,
                lastVisitAt: now,
                visitsHistory: [visitEntry],
            });

            await visitor.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Visitor tracked successfully',
            data: {
                ip: clientIp,
                country: visitor.country,
                city: visitor.city,
                browser: visitor.browser,
                device: visitor.device,
                totalVisits: visitor.totalVisits,
            },
        });
    } catch (error) {
        console.error('Error tracking visitor:', error);
        // Fail silently with 200 so visitor tracking never breaks client browsing
        return res.status(200).json({
            success: false,
            message: 'Tracking skipped or encountered a non-fatal issue: ' + error.message,
        });
    }
};

/**
 * Admin Endpoint: Get all visitors with filters and stats
 * GET /api/visitors
 */
exports.getAllVisitors = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 25,
            search = '',
            period = 'all',
            device = '',
            country = '',
            sortBy = 'lastVisitAt',
            sortOrder = 'desc',
        } = req.query;

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
        const skip = (pageNum - 1) * limitNum;

        // Build filter object
        const filter = {};

        // Period filter
        const now = new Date();
        if (period === 'today') {
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            filter.lastVisitAt = { $gte: startOfToday };
        } else if (period === '7days') {
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filter.lastVisitAt = { $gte: sevenDaysAgo };
        } else if (period === '30days') {
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filter.lastVisitAt = { $gte: thirtyDaysAgo };
        }

        // Device filter
        if (device && ['Desktop', 'Mobile', 'Tablet', 'Bot'].includes(device)) {
            filter.device = device;
        }

        // Country filter
        if (country) {
            filter.country = { $regex: country, $options: 'i' };
        }

        // Search filter (matches IP, City, Country, or LastPath)
        if (search && search.trim()) {
            const searchRegex = { $regex: search.trim(), $options: 'i' };
            filter.$or = [
                { ip: searchRegex },
                { city: searchRegex },
                { country: searchRegex },
                { lastPath: searchRegex },
                { browser: searchRegex },
                { os: searchRegex },
                { lastReferrer: searchRegex },
            ];
        }

        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [visitors, totalFiltered] = await Promise.all([
            Visitor.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Visitor.countDocuments(filter),
        ]);

        // Compute high-level analytics stats
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [
            totalUniqueCount,
            todayActiveCount,
            totalVisitsSumResult,
            topCountriesAggregate,
            topPagesAggregate,
            deviceStatsAggregate,
        ] = await Promise.all([
            Visitor.countDocuments(),
            Visitor.countDocuments({ lastVisitAt: { $gte: startOfToday } }),
            Visitor.aggregate([
                { $group: { _id: null, total: { $sum: '$totalVisits' } } },
            ]),
            Visitor.aggregate([
                { $match: { country: { $ne: 'Unknown' } } },
                { $group: { _id: '$country', code: { $first: '$countryCode' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 6 },
            ]),
            Visitor.aggregate([
                { $group: { _id: '$lastPath', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 6 },
            ]),
            Visitor.aggregate([
                { $group: { _id: '$device', count: { $sum: 1 } } },
            ]),
        ]);

        const totalVisitsSum = totalVisitsSumResult[0]?.total || totalUniqueCount;

        const deviceBreakdown = {
            desktop: 0,
            mobile: 0,
            tablet: 0,
            bot: 0,
        };
        deviceStatsAggregate.forEach((item) => {
            const key = (item._id || '').toLowerCase();
            if (deviceBreakdown[key] !== undefined) {
                deviceBreakdown[key] = item.count;
            }
        });

        const stats = {
            totalUniqueVisitors: totalUniqueCount,
            todayActiveVisitors: todayActiveCount,
            totalVisitsCount: totalVisitsSum,
            topCountries: topCountriesAggregate.map((c) => ({
                country: c._id,
                code: c.code,
                count: c.count,
            })),
            topPages: topPagesAggregate.map((p) => ({
                path: p._id || '/',
                count: p.count,
            })),
            deviceBreakdown,
        };

        return res.status(200).json({
            success: true,
            count: visitors.length,
            total: totalFiltered,
            totalPages: Math.ceil(totalFiltered / limitNum) || 1,
            currentPage: pageNum,
            stats,
            data: visitors,
        });
    } catch (error) {
        console.error('Error fetching visitors:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve visitor traffic: ' + error.message,
        });
    }
};

/**
 * Admin Endpoint: Get visitor by ID with full visit history
 * GET /api/visitors/:id
 */
exports.getVisitorById = async (req, res) => {
    try {
        const { id } = req.params;
        const visitor = await Visitor.findById(id);

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: 'Visitor record not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: visitor,
        });
    } catch (error) {
        console.error('Error fetching visitor by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch visitor: ' + error.message,
        });
    }
};

/**
 * Admin Endpoint: Delete a visitor record
 * DELETE /api/visitors/:id
 */
exports.deleteVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Visitor.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Visitor record not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: `Visitor log for IP ${deleted.ip} deleted successfully`,
        });
    } catch (error) {
        console.error('Error deleting visitor:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete visitor record: ' + error.message,
        });
    }
};

/**
 * Superadmin Endpoint: Clear all or old visitor records
 * DELETE /api/visitors
 */
exports.clearAllVisitors = async (req, res) => {
    try {
        const { olderThanDays } = req.query;

        let deleteFilter = {};
        if (olderThanDays) {
            const days = parseInt(olderThanDays, 10);
            if (!isNaN(days) && days > 0) {
                const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
                deleteFilter = { lastVisitAt: { $lt: cutoff } };
            }
        }

        const result = await Visitor.deleteMany(deleteFilter);

        return res.status(200).json({
            success: true,
            message: `Successfully cleared ${result.deletedCount} visitor log(s)`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Error clearing visitors:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to clear visitor records: ' + error.message,
        });
    }
};
