const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'programming_bridge_super_jwt_secret_2026_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Admin Auto-seeder helper
const ensureAdminExists = async () => {
    const adminEmail = 'official@programmingbridge.org';
    const adminPassword = 'Has1439@';
    const adminName = 'Programming Bridge Admin';

    let admin = await User.findOne({ email: adminEmail }).select('+password');
    if (!admin) {
        admin = new User({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'superadmin',
            isActive: true,
        });
        await admin.save();
        console.log(`✅ Main Superadmin initialized: ${adminEmail}`);
    } else if (admin.role !== 'superadmin') {
        admin.role = 'superadmin';
        await admin.save();
    }
    return admin;
};

exports.ensureAdminExists = ensureAdminExists;


// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Auto-seed default admin if database has no users yet
        await ensureAdminExists().catch(() => {});

        // Find user with password included
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.',
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                lastLogin: user.lastLogin,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error during login',
        });
    }
};

// Register Controller (Admin creation)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email address already exists',
            });
        }

        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            role: role || 'admin',
        });

        await user.save();

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration',
        });
    }
};

// Get current logged-in user profile
exports.getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect current password',
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error while changing password',
        });
    }
};

// Seed / Initialize Admin Endpoint
exports.initAdmin = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return res.status(200).json({
                success: true,
                message: 'Admin account already exists',
                count: userCount,
            });
        }

        const defaultAdmin = new User({
            name: 'Programming Bridge Admin',
            email: 'official@programmingbridge.org',
            password: 'Has1439@',
            role: 'superadmin',
        });
        await defaultAdmin.save();

        return res.status(201).json({
            success: true,
            message: 'Default superadmin initialized successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error initializing admin',
        });
    }
};

// ===================== SUPERADMIN USER MANAGEMENT =====================

// Get All Users (Superadmin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch users',
        });
    }
};

// Create New User (Superadmin only)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, isActive } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password',
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email address already exists',
            });
        }

        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: role || 'admin',
            isActive: isActive !== false,
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: `User ${user.name} (${user.role}) created successfully`,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create user',
        });
    }
};

// Update User (Superadmin only)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, isActive, password } = req.body;

        const user = await User.findById(id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (name) user.name = name.trim();
        if (role && ['superadmin', 'admin', 'editor'].includes(role)) {
            user.role = role;
        }
        if (typeof isActive === 'boolean') {
            user.isActive = isActive;
        }
        if (password && password.length >= 6) {
            user.password = password;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user',
        });
    }
};

// Delete User (Superadmin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent superadmin from deleting themselves
        if (req.user._id.toString() === id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own active superadmin account.',
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: `User ${user.name} (${user.email}) deleted successfully`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete user',
        });
    }
};
