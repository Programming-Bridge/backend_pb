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

const defaultProjects = [
    {
        title: "Enaam – Skill Prize & Competition Suite",
        slug: "enaam-skill-prize-competition-suite",
        badge: "Mobile & Gamification",
        category: "Mobile Apps",
        client: "Amanah Mall",
        description:
            "A high-engagement mobile gamification and prize competition ecosystem engineered for seamless digital ticketing, skill-based live quiz trivia, real-time winner verification, and automated shopping festival lucky draws for 500k+ active shoppers.",
        shortDescription:
            "High-concurrency mobile gamification platform featuring live skill-based trivia tournaments, QR invoice verification, automated lucky draws, and real-time winner broadcasts.",
        technologies: ["Flutter", "Kotlin", "Node.js", "Redis", "Firebase FCM", "PostgreSQL", "REST APIs"],
        image: "/projects/enaam.jpg",
        liveLink: "https://play.google.com/store/apps/details?id=com.app.enaam",
        gitLink: "https://github.com/Programming-Bridge/enaam-prize-competition-app",
        featured: true,
        order: 1,
        isActive: true,
    },
    {
        title: "Running Tribe – GPS Running & Community",
        slug: "running-tribe-gps-fitness-community",
        badge: "Fitness & Geo-Tracking",
        category: "Mobile Apps",
        client: "RUNNING TRIBE LTD",
        description:
            "A modern GPS-enabled running and social fitness platform engineered for high-precision real-time route discovery, event hosting, club feeds, telemetry analytics, and community leaderboards across iOS and Android.",
        shortDescription:
            "Real-time GPS route exploration and running community platform with live telemetry stats, event scheduling, and runner club feeds.",
        technologies: ["React Native", "Mapbox SDK", "FastAPI", "PostGIS", "Redis", "Firebase", "WebSockets"],
        image: "/projects/running_tribe.jpg",
        liveLink: "https://play.google.com/store/apps/details?id=com.runningtribe",
        gitLink: "https://github.com/Programming-Bridge/running-tribe-mobile-app",
        featured: true,
        order: 2,
        isActive: true,
    },
    {
        title: "Fitness Freak – Workout & Nutrition Planner",
        slug: "fitness-freak-workout-nutrition-planner",
        badge: "Workout & Nutrition",
        category: "Mobile Apps",
        client: "WEBEVIS TECHNOLOGIES",
        description:
            "A cross-platform home fitness and macro nutrition ecosystem engineered with 3D animated exercise guides, targeted muscle activation analytics, custom meal diet plans, offline workout caching, and automated progression logging.",
        shortDescription:
            "All-in-one home workout and diet planner featuring animated exercise guides, reps countdown timers, macro nutrition tracker, and offline caching.",
        technologies: ["Flutter", "Jetpack Compose", "Node.js", "MongoDB", "Lottie", "Firebase FCM", "Room DB"],
        image: "/projects/fitness_freak.jpg",
        liveLink: "https://play.google.com/store/apps/details?id=com.fitnessfreak",
        gitLink: "https://github.com/Programming-Bridge/fitness-freak-workout-app",
        featured: true,
        order: 3,
        isActive: true,
    },
    {
        title: "OmniChannel E-Commerce Engine",
        slug: "omnichannel-ecommerce-engine",
        badge: "High-Volume E-Commerce",
        category: "Web Development",
        client: "RetailX Enterprises",
        description:
            "A distributed e-commerce architecture engineered for high concurrency, sub-100ms checkout response times, Redis distributed caching, and automated inventory sync across 4 global fulfillment hubs.",
        shortDescription:
            "Sub-100ms microservices architecture handling 50k+ daily transactions with Next.js 15, Redis caching, and Stripe payment gateway.",
        technologies: ["Next.js 15", "TypeScript", "Node.js", "Redis", "PostgreSQL", "Stripe API"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
        liveLink: "https://ecommerce.programmingbridge.com",
        gitLink: "https://github.com/Programming-Bridge/ecommerce-microservices-engine",
        featured: true,
        order: 4,
        isActive: true,
    },
    {
        title: "TeleHealth Pro Mobile Suite",
        slug: "telehealth-pro-mobile-suite",
        badge: "Healthcare Tech",
        category: "Mobile Apps",
        client: "NovaCare Health",
        description:
            "HIPAA-compliant native Android and cross-platform mobile ecosystem providing encrypted peer-to-peer WebRTC video consultations, electronic health records, and offline prescription synchronization.",
        shortDescription:
            "HIPAA-compliant native Android & Flutter telehealth platform with real-time WebRTC video consultations and offline prescription sync.",
        technologies: ["Kotlin", "Jetpack Compose", "Flutter", "WebRTC", "Room DB", "FastAPI"],
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
        liveLink: "https://telehealth.programmingbridge.com",
        gitLink: "https://github.com/Programming-Bridge/telehealth-mobile-suite",
        featured: true,
        order: 5,
        isActive: true,
    },
    {
        title: "Enterprise RAG Knowledge Copilot",
        slug: "enterprise-rag-knowledge-copilot",
        badge: "AI Automation",
        category: "AI & ML",
        client: "Acuity Financial",
        description:
            "An autonomous generative AI copilot integrating hybrid semantic search, Qdrant vector databases, and multi-agent reasoning pipelines to query 100,000+ financial regulatory documents in seconds.",
        shortDescription:
            "Autonomous document intelligence engine combining vector embeddings, multi-stage reranking, and Claude 3.5 Sonnet for enterprise PDF search.",
        technologies: ["Python", "FastAPI", "PyTorch", "Qdrant", "LangChain", "OpenAI"],
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
        liveLink: "https://ai-copilot.programmingbridge.com",
        gitLink: "https://github.com/Programming-Bridge/enterprise-rag-copilot",
        featured: true,
        order: 6,
        isActive: true,
    },
    {
        title: "CloudOps Multi-Region K8s Dashboard",
        slug: "cloudops-multi-region-k8s-dashboard",
        badge: "Cloud Architecture",
        category: "Cloud & DevOps",
        client: "Synthetix Cloud",
        description:
            "Unified multi-tenant cloud operations platform monitoring Kubernetes cluster nodes, Prometheus metric streams, automated canary rollouts, and zero-trust IAM access policies across AWS and GCP.",
        shortDescription:
            "Unified multi-tenant observability and cluster auto-scaling portal with Prometheus metrics and Grafana live telemetry.",
        technologies: ["Go", "Docker", "Kubernetes", "Next.js", "Prometheus", "AWS"],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
        liveLink: "https://cloudops.programmingbridge.com",
        gitLink: "https://github.com/Programming-Bridge/multi-region-k8s-observability",
        featured: false,
        order: 7,
        isActive: true,
    },
    {
        title: "Headless WordPress Media Publisher",
        slug: "headless-wordpress-media-publisher",
        badge: "Headless CMS",
        category: "CMS & E-Commerce",
        client: "Global Dispatch Media",
        description:
            "Decoupled enterprise publishing platform serving 2M+ monthly unique readers. Features Next.js Incremental Static Regeneration (ISR), GraphQL APIs, and sub-second full-text Algolia search.",
        shortDescription:
            "Ultra-fast headless news portal serving 2M+ monthly readers with ISR (Incremental Static Regeneration), GraphQL, and Algolia instant search.",
        technologies: ["WordPress REST", "GraphQL", "Next.js 15", "Tailwind CSS", "Algolia", "Vercel Edge"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
        liveLink: "https://media-publisher.programmingbridge.com",
        gitLink: "https://github.com/Programming-Bridge/headless-wordpress-nextjs-publisher",
        featured: false,
        order: 8,
        isActive: true,
    },
    {
        title: "FinTrack Android Personal Wealth Engine",
        slug: "fintrack-android-personal-wealth",
        badge: "Fintech Mobile",
        category: "Mobile Apps",
        client: "FinEdge Labs",
        description:
            "Local-first Android wealth manager engineered in modern Kotlin and Jetpack Compose. Utilizes SQLCipher database encryption, biometric authentication, and reactive coroutine pipelines.",
        shortDescription:
            "Native Android finance tracker featuring biometrics, SQLite encryption (SQLCipher), interactive MPAndroidChart data visualizations, and local-first architecture.",
        technologies: ["Kotlin", "Jetpack Compose", "Coroutines", "Room", "SQLCipher", "MVI"],
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
        liveLink: "https://fintrack.programmingbridge.com",
        gitLink: "https://github.com/Programming-Bridge/fintrack-android-wealth-engine",
        featured: false,
        order: 9,
        isActive: true,
    },
    {
        title: "Logistics Fleet Route Optimization Engine",
        slug: "logistics-fleet-route-optimization",
        badge: "Logistics SaaS",
        category: "Web Development",
        client: "Apex Freight Solutions",
        description:
            "Real-time telematics and dynamic dispatch engine incorporating genetic routing algorithms, Leaflet geospatial mapping, and Redis Pub/Sub live driver telemetry for over 1,200 commercial carriers.",
        shortDescription:
            "Real-time dispatch platform with genetic path-finding algorithms reducing last-mile fuel consumption by 24% for 1,200+ fleet vehicles.",
        technologies: ["TypeScript", "React", "Node.js", "PostGIS", "Redis", "Leaflet"],
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80",
        liveLink: "https://logistics.programmingbridge.com",
        gitLink: "https://github.com/Programming-Bridge/fleet-route-optimization-engine",
        featured: false,
        order: 10,
        isActive: true,
    },
];

// Helper: Auto-seed if empty
const ensureProjectsSeed = async () => {
    try {
        const count = await Project.countDocuments();
        if (count === 0) {
            await Project.insertMany(defaultProjects);
            console.log(`[Project] Auto-seeded ${defaultProjects.length} projects`);
        }
    } catch (err) {
        console.error('[Project] Auto-seed failed:', err.message);
    }
};

// Seed / Re-seed projects endpoint
exports.seedProjects = async (req, res) => {
    try {
        await Project.deleteMany({});
        const seeded = await Project.insertMany(defaultProjects);
        memoryCache.invalidatePrefix('projects');

        return res.status(201).json({
            success: true,
            count: seeded.length,
            message: `Successfully seeded ${seeded.length} projects`,
            data: seeded,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to seed projects',
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

        await ensureProjectsSeed();

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



