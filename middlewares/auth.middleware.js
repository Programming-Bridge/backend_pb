const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'programming_bridge_super_jwt_secret_2026_key';

// Verify Bearer Token Middleware
const verifyToken = async (req, res, next) => {
    try {
        let token = null;
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.query && req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No authentication token provided.',
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user by id from payload
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists or invalid token.',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated.',
            });
        }

        req.user = user;
        req.tokenPayload = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please log in again.',
                isExpired: true,
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid or malformed authentication token.',
        });
    }
};

// Check Admin or Superadmin Role Middleware
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.',
        });
    }

    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Forbidden. Admin privileges required.',
    });
};

// Check Superadmin Role Middleware
const isSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.',
        });
    }

    if (req.user.role === 'superadmin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Forbidden. Superadmin privileges required.',
    });
};

module.exports = {
    verifyToken,
    isAdmin,
    isSuperAdmin,
};
