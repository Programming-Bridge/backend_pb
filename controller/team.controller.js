const Team = require('../model/team.model');
const memoryCache = require('../utils/cache.util');

// Default initial senior squad members
const defaultTeamMembers = [
    {
        name: "Usama Khan",
        role: "Lead Software Architect & Founder",
        department: "Web & Cloud",
        bio: "Specializing in distributed systems, full-stack microservices, sub-100ms API query optimization, and enterprise Next.js architectures.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        skills: ["Next.js 15", "TypeScript", "Node.js", "PostgreSQL", "System Architecture", "AWS"],
        experience: "7+ Years",
        socialLinks: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "usama@programmingbridge.com",
        },
        order: 1,
        featured: true,
    },
    {
        name: "Alex Rivera",
        role: "Principal Mobile Engineer",
        department: "Mobile Engineering",
        bio: "Crafting native Android architectures with Jetpack Compose, Kotlin coroutines, and high-performance Flutter / React Native solutions.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Flutter", "MVI Architecture", "Room DB"],
        experience: "6+ Years",
        socialLinks: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
        },
        order: 2,
        featured: true,
    },
    {
        name: "Dr. Marcus Chen",
        role: "Lead AI & Data Scientist",
        department: "AI & Data",
        bio: "Focusing on production LLM workflows, Retrieval-Augmented Generation (RAG), PyTorch neural models, and real-time inference microservices.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        skills: ["PyTorch", "Python", "FastAPI", "OpenAI / RAG", "Vector DBs", "Docker MLOps"],
        experience: "8+ Years",
        socialLinks: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
        },
        order: 3,
        featured: true,
    },
    {
        name: "Elena Rostova",
        role: "DevOps & Cloud Security Architect",
        department: "DevOps & Security",
        bio: "Designing zero-downtime CI/CD pipelines, Kubernetes container orchestration, and SOC-2/OWASP compliance infrastructure.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
        skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Zero-Trust Auth"],
        experience: "6+ Years",
        socialLinks: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
        },
        order: 4,
        featured: false,
    },
];

// Helper: Auto-seed if empty
const ensureTeamSeed = async () => {
    try {
        const count = await Team.countDocuments();
        if (count === 0) {
            await Team.insertMany(defaultTeamMembers);
            console.log(`[Team] Auto-seeded ${defaultTeamMembers.length} team members`);
        }
    } catch (err) {
        console.error('[Team] Auto-seed failed:', err.message);
    }
};

// GET all team members (supports filters: department, search, all)
exports.getAllTeamMembers = async (req, res) => {
    try {
        const cacheKey = `team_${JSON.stringify(req.query)}`;
        const cached = memoryCache.get(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        await ensureTeamSeed();

        const { department, search, all, featured } = req.query;
        const filter = {};

        if (all !== 'true') {
            filter.isActive = true;
        }

        if (department && department !== 'All') {
            filter.department = new RegExp(department, 'i');
        }

        if (typeof featured !== 'undefined') {
            filter.featured = featured === 'true';
        }

        if (search) {
            const sRegex = new RegExp(search, 'i');
            filter.$or = [
                { name: sRegex },
                { role: sRegex },
                { bio: sRegex },
                { skills: sRegex },
                { department: sRegex },
            ];
        }

        const members = await Team.find(filter).sort({ order: 1, createdAt: 1 }).lean();

        const responsePayload = {
            success: true,
            count: members.length,
            data: members,
        };

        memoryCache.set(cacheKey, responsePayload, 120);

        return res.status(200).json(responsePayload);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch team members',
        });
    }
};

// GET single team member by ID
exports.getTeamMemberById = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: member,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch team member',
        });
    }
};

// POST create team member
exports.createTeamMember = async (req, res) => {
    try {
        const { name, role, department, bio, avatar, skills, experience, socialLinks, order, featured, isActive } = req.body;

        if (!name || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name and role are required',
            });
        }

        const newMember = new Team({
            name,
            role,
            department: department || 'Web & Cloud',
            bio: bio || '',
            avatar: avatar || '',
            skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : [],
            experience: experience || '5+ Years',
            socialLinks: socialLinks || {},
            order: Number(order) || 0,
            featured: featured === true || featured === 'true',
            isActive: isActive !== false,
        });

        const saved = await newMember.save();
        memoryCache.invalidatePrefix('team');

        return res.status(201).json({
            success: true,
            message: 'Team member created successfully',
            data: saved,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create team member',
        });
    }
};

// PUT update team member
exports.updateTeamMember = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.skills && typeof updateData.skills === 'string') {
            updateData.skills = updateData.skills.split(',').map(s => s.trim());
        }

        const updated = await Team.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found',
            });
        }

        memoryCache.invalidatePrefix('team');

        return res.status(200).json({
            success: true,
            message: 'Team member updated successfully',
            data: updated,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update team member',
        });
    }
};

// DELETE team member
exports.deleteTeamMember = async (req, res) => {
    try {
        const deleted = await Team.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found',
            });
        }

        memoryCache.invalidatePrefix('team');

        return res.status(200).json({
            success: true,
            message: 'Team member deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete team member',
        });
    }
};

// POST re-seed default team
exports.seedTeam = async (req, res) => {
    try {
        await Team.deleteMany({});
        const seeded = await Team.insertMany(defaultTeamMembers);
        memoryCache.invalidatePrefix('team');

        return res.status(200).json({
            success: true,
            count: seeded.length,
            message: `Successfully seeded ${seeded.length} team members`,
            data: seeded,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to seed team',
        });
    }
};
