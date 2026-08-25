const Career = require('../model/career.model');
const memoryCache = require('../utils/cache.util');

// Seed realistic career positions
const sampleCareers = [
    {
        title: "Senior Full-Stack Next.js / Node.js Engineer",
        slug: "senior-fullstack-nextjs-nodejs-engineer",
        department: "Full-Stack & Web",
        location: "Remote / Global",
        type: "Full-Time",
        experience: "4+ Years",
        salaryRange: "$70,000 - $110,000 / Year",
        badge: "FEATURED ROLE",
        description: "Lead the architectural design and implementation of high-throughput web applications using Next.js 15, React 19, Node.js, and distributed microservices.",
        skills: ["Next.js", "React 19", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Redis"],
        responsibilities: [
            "Architect and maintain scalable Next.js App Router applications with sub-100ms response targets.",
            "Design clean RESTful and GraphQL backend microservices with strict schema validation.",
            "Participate in code reviews, technical roadmaps, and mentoring junior engineers.",
            "Write comprehensive integration tests and CI/CD deployment pipelines on AWS."
        ],
        requirements: [
            "4+ years of professional full-stack development experience with React and Node.js.",
            "Deep proficiency in TypeScript, asynchronous event loops, and database indexing.",
            "Strong understanding of modern web performance, Core Web Vitals, and caching strategies."
        ],
        benefits: [
            "100% Remote-first work culture with flexible hours",
            "Health & Dental coverage allowance",
            "$2,500 annual home office & tech hardware stipend",
            "Generous paid time off and conference sponsorships"
        ],
        order: 1,
        isOpen: true,
        isActive: true,
    },
    {
        title: "Senior Android Native Engineer (Jetpack Compose)",
        slug: "senior-android-jetpack-compose-engineer",
        department: "Mobile Engineering",
        location: "Remote / Hybrid",
        type: "Full-Time",
        experience: "3+ Years",
        salaryRange: "$65,000 - $95,000 / Year",
        badge: "HOT OPENING",
        description: "Build fluid, 120 FPS native Android apps using Kotlin, Jetpack Compose, Coroutines, Flow, and clean MVI/MVVM architectures.",
        skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Flow", "Room DB", "Hilt", "Clean Architecture"],
        responsibilities: [
            "Develop modern, declarative UI layouts with Jetpack Compose and Material 3 design systems.",
            "Implement resilient offline caching, Room SQLite databases, and encrypted local storage.",
            "Optimize app memory footprints, startup times, and smooth framerate transitions.",
            "Publish and manage releases on the Google Play Store with automated Fastlane pipelines."
        ],
        requirements: [
            "3+ years of native Android development with a strong portfolio of shipped Play Store apps.",
            "Expertise in Kotlin, Coroutines, Flow, and dependency injection with Hilt/Dagger.",
            "Solid grasp of clean architecture principles and unit testing with MockK / JUnit."
        ],
        benefits: [
            "Remote work environment with modern hardware provided",
            "Paid learning budgets and Google Cloud / Android certifications",
            "Bi-annual performance bonuses"
        ],
        order: 2,
        isOpen: true,
        isActive: true,
    },
    {
        title: "Senior AI / GenAI & MLOps Engineer",
        slug: "senior-ai-genai-mlops-engineer",
        department: "AI & Data Science",
        location: "Remote / Global",
        type: "Full-Time",
        experience: "4+ Years",
        salaryRange: "$80,000 - $125,000 / Year",
        badge: "URGENT HIRING",
        description: "Build cutting-edge enterprise RAG pipelines, autonomous agent workflows, and scalable model inference microservices with PyTorch, OpenAI, and FastAPI.",
        skills: ["Python", "PyTorch", "FastAPI", "OpenAI", "LangChain", "Pinecone", "Docker", "MLOps"],
        responsibilities: [
            "Design and deploy production-grade RAG systems with vector databases (Pinecone, Qdrant, Chroma).",
            "Build asynchronous FastAPI model serving microservices optimized for high concurrency.",
            "Fine-tune transformer models and implement automated evaluation metrics.",
            "Containerize AI pipelines using Docker and deploy to GPU-accelerated cloud clusters."
        ],
        requirements: [
            "3+ years building production Python AI/ML applications and API microservices.",
            "Experience with modern foundation models, embedding vectors, and prompt engineering pipelines.",
            "Strong grasp of linear algebra, neural network architectures, and containerized deployment."
        ],
        benefits: [
            "Access to top-tier GPU compute credits and frontier LLM APIs",
            "100% remote flexibility with global colleagues",
            "Comprehensive health and wellness benefits"
        ],
        order: 3,
        isOpen: true,
        isActive: true,
    },
    {
        title: "Senior Cloud & DevOps Infrastructure Architect",
        slug: "senior-cloud-devops-infrastructure-architect",
        department: "Cloud & DevOps",
        location: "Remote / Global",
        type: "Full-Time",
        experience: "4+ Years",
        salaryRange: "$75,000 - $115,000 / Year",
        badge: "CORE INFRA",
        description: "Own our cloud infrastructure automation, Kubernetes clusters, zero-downtime CI/CD workflows, and multi-region observability on AWS and Cloudflare.",
        skills: ["Kubernetes", "Docker", "AWS", "Terraform", "GitHub Actions", "Prometheus", "Linux"],
        responsibilities: [
            "Manage multi-cluster Kubernetes deployments with automated horizontal pod autoscaling.",
            "Write modular Infrastructure-as-Code with Terraform to maintain immutable environments.",
            "Establish end-to-end observability stacks with Prometheus, Grafana, and ELK/Loki.",
            "Enforce security best practices, vulnerability scanning, and automated backup disaster recovery."
        ],
        requirements: [
            "4+ years managing production AWS/GCP cloud environments and containerized microservices.",
            "Hands-on expertise with Terraform, Docker, Kubernetes, and Linux systems administration.",
            "Track record of maintaining 99.99% system availability."
        ],
        benefits: [
            "Flexible remote schedule across timezones",
            "Generous equipment budget and cloud lab sandbox",
            "Performance and milestone bonus structures"
        ],
        order: 4,
        isOpen: true,
        isActive: true,
    },
    {
        title: "Senior UI/UX & Product Design Specialist",
        slug: "senior-ui-ux-product-designer",
        department: "UI/UX & Product Design",
        location: "Remote",
        type: "Full-Time",
        experience: "3+ Years",
        salaryRange: "$55,000 - $85,000 / Year",
        badge: "CREATIVE LEAD",
        description: "Craft pixel-perfect user journeys, design systems, and interactive prototypes in Figma for web and mobile platforms.",
        skills: ["Figma", "Design Systems", "Prototyping", "Design Tokens", "Wireframing", "User Research"],
        responsibilities: [
            "Create comprehensive design systems with responsive tokens, typography, and atomic components.",
            "Conduct user interviews, usability testing, and translate user feedback into clean interface designs.",
            "Collaborate closely with frontend engineers to ensure 100% design fidelity in production code."
        ],
        requirements: [
            "3+ years designing complex SaaS dashboards, e-commerce platforms, and native mobile apps.",
            "Mastery of Figma, auto-layout, interactive components, and token variables.",
            "Strong portfolio demonstrating human-centered design thinking and crisp aesthetics."
        ],
        benefits: [
            "Latest design software subscriptions and hardware provided",
            "Creative autonomy and collaborative team environment",
            "Flexible working hours"
        ],
        order: 5,
        isOpen: true,
        isActive: true,
    },
];

// 1. GET all career openings with filters
exports.getAllCareers = async (req, res) => {
    try {
        const cacheKey = `careers_${JSON.stringify(req.query)}`;
        const cached = memoryCache.get(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        const { department, type, search, all } = req.query;
        let query = all === 'true' ? {} : { isActive: true, isOpen: true };

        if (department && department !== 'All') {
            query.department = new RegExp(`^${department.trim()}$`, 'i');
        }

        if (type && type !== 'All') {
            query.type = new RegExp(`^${type.trim()}$`, 'i');
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        let careers = await Career.find(query).sort({ order: 1, createdAt: -1 }).lean();

        // Auto-seed if database is empty
        if (careers.length === 0 && !department && !search) {
            careers = await Career.insertMany(sampleCareers);
        }

        const responsePayload = {
            success: true,
            count: careers.length,
            data: careers,
        };

        memoryCache.set(cacheKey, responsePayload, 120);

        return res.status(200).json(responsePayload);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch careers',
        });
    }
};

// 2. GET single career by ID
exports.getCareerById = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id).lean();
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career opening not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: career,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch career',
        });
    }
};

// 3. GET career by Slug
exports.getCareerBySlug = async (req, res) => {
    try {
        const career = await Career.findOne({ slug: req.params.slug.toLowerCase() }).lean();
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career opening not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: career,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch career',
        });
    }
};

// 4. CREATE new career opening
exports.createCareer = async (req, res) => {
    try {
        const career = await Career.create(req.body);
        memoryCache.invalidatePrefix('careers');
        return res.status(201).json({
            success: true,
            message: 'Career opening created successfully',
            data: career,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Failed to create career opening',
        });
    }
};

// 5. UPDATE career opening
exports.updateCareer = async (req, res) => {
    try {
        const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career opening not found',
            });
        }
        memoryCache.invalidatePrefix('careers');
        return res.status(200).json({
            success: true,
            message: 'Career opening updated successfully',
            data: career,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Failed to update career opening',
        });
    }
};

// 6. DELETE career opening
exports.deleteCareer = async (req, res) => {
    try {
        const career = await Career.findByIdAndDelete(req.params.id);
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career opening not found',
            });
        }
        memoryCache.invalidatePrefix('careers');
        return res.status(200).json({
            success: true,
            message: 'Career opening deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete career opening',
        });
    }
};

// 7. SEED career openings
exports.seedCareers = async (req, res) => {
    try {
        await Career.deleteMany({});
        const seeded = await Career.insertMany(sampleCareers);
        memoryCache.invalidatePrefix('careers');
        return res.status(200).json({
            success: true,
            count: seeded.length,
            message: `Successfully seeded ${seeded.length} career positions`,
            data: seeded,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to seed careers',
        });
    }
};
