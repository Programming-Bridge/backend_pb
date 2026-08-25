const TechStack = require('../model/techStack.model');
const memoryCache = require('../utils/cache.util');

// Initial default seed items
const defaultTechItems = [
    // 1. Software / Web & Cloud
    {
        id: "react",
        name: "React",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        domain: "software",
        category: "frontend",
        categoryLabel: "Frontend UI",
        badge: "UI Library",
        shortDesc: "High-performance reactive interfaces with declarative components & state hooks.",
        highlight: "Virtual DOM & Concurrent Mode",
        order: 1,
    },
    {
        id: "nextjs",
        name: "Next.js",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        domain: "software",
        category: "frontend",
        categoryLabel: "Fullstack Web",
        badge: "App Router / SSR",
        shortDesc: "Production-grade React framework with hybrid SSR, static generation, and edge routing.",
        highlight: "Server Components & SEO",
        invertInDark: false,
        order: 2,
    },
    {
        id: "typescript",
        name: "TypeScript",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        domain: "software",
        category: "frontend",
        categoryLabel: "Languages",
        badge: "Type Safety",
        shortDesc: "Strict static typing and advanced type inference for rock-solid codebases at scale.",
        highlight: "Zero-Cost Compile Safety",
        order: 3,
    },
    {
        id: "javascript",
        name: "JavaScript",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        domain: "software",
        category: "frontend",
        categoryLabel: "Languages",
        badge: "ES6+ Engine",
        shortDesc: "Universal web runtime language driving asynchronous workflows and dynamic web apps.",
        highlight: "Event Loop & V8 Optimizations",
        order: 4,
    },
    {
        id: "bootstrap",
        name: "Bootstrap",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
        domain: "software",
        category: "frontend",
        categoryLabel: "Design Systems",
        badge: "Responsive Grid",
        shortDesc: "Rapid prototyping and responsive UI grid system with customizable utilities.",
        highlight: "Mobile-First Grid & Tokens",
        order: 5,
    },
    {
        id: "tailwindcss",
        name: "Tailwind CSS",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        domain: "software",
        category: "frontend",
        categoryLabel: "Styling & Tokens",
        badge: "Utility-First",
        shortDesc: "Composable styling system providing rapid UI development without stylesheet bloat.",
        highlight: "JIT Compiler & Theme Engine",
        order: 6,
    },
    {
        id: "nodejs",
        name: "Node.js",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        domain: "software",
        category: "backend",
        categoryLabel: "Backend Runtime",
        badge: "Event-Driven",
        shortDesc: "Non-blocking, event-driven server runtime handling thousands of concurrent connections.",
        highlight: "Microservices & Async I/O",
        order: 7,
    },
    {
        id: "express",
        name: "Express.js",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
        domain: "software",
        category: "backend",
        categoryLabel: "API Framework",
        badge: "REST Architecture",
        shortDesc: "Minimalist and flexible web framework for robust HTTP routing and RESTful services.",
        highlight: "Middleware Pipeline & Speed",
        invertInDark: true,
        order: 8,
    },
    {
        id: "python",
        name: "Python",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        domain: "software",
        category: "backend",
        categoryLabel: "Languages & AI",
        badge: "AI / Automation",
        shortDesc: "Versatile language powering intelligent workflows, data engineering, and automation.",
        highlight: "Data Pipelines & AI Tooling",
        order: 9,
    },
    {
        id: "django",
        name: "Django",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
        domain: "software",
        category: "backend",
        categoryLabel: "Backend Framework",
        badge: "Batteries-Included",
        shortDesc: "High-level Python web framework with built-in ORM, security safeguards, and admin suite.",
        highlight: "Secure ORM & Rapid Auth",
        invertInDark: true,
        order: 10,
    },
    {
        id: "graphql",
        name: "GraphQL",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
        domain: "software",
        category: "backend",
        categoryLabel: "API Query Layer",
        badge: "Query Language",
        shortDesc: "Declarative data fetching API enabling clients to request exactly what they need.",
        highlight: "Type-safe Schemas & Federations",
        order: 11,
    },
    {
        id: "mongodb",
        name: "MongoDB",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        domain: "software",
        category: "database",
        categoryLabel: "NoSQL Database",
        badge: "Document Store",
        shortDesc: "Distributed JSON-like document database offering dynamic schemas and horizontal sharding.",
        highlight: "Aggregation Pipeline & Atlas",
        order: 12,
    },
    {
        id: "postgresql",
        name: "PostgreSQL",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        domain: "software",
        category: "database",
        categoryLabel: "SQL Database",
        badge: "ACID Compliant",
        shortDesc: "Enterprise relational database with complex query optimization and extensions.",
        highlight: "Vector Search & Concurrency",
        order: 13,
    },
    {
        id: "mysql",
        name: "MySQL / SQL",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        domain: "software",
        category: "database",
        categoryLabel: "SQL Database",
        badge: "High Throughput",
        shortDesc: "Proven relational database engine trusted for transactions and web scale.",
        highlight: "InnoDB Indexing & Replication",
        order: 14,
    },

    // 2. AI & Data Science
    {
        id: "scikit-learn",
        name: "Scikit-learn",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
        domain: "ai-ml",
        category: "Classical ML",
        categoryLabel: "Machine Learning",
        badge: "Classical ML",
        shortDesc: "Standard toolset for classification, regression, clustering, and PCA dimensionality reduction.",
        highlight: "Model Tuning & Pipelines",
        order: 20,
    },
    {
        id: "xgboost",
        name: "XGBoost",
        svgUrl: "https://raw.githubusercontent.com/dmlc/dmlc.github.io/master/img/logo-m/xgboost.png",
        domain: "ai-ml",
        category: "Classical ML",
        categoryLabel: "Gradient Boosting",
        badge: "Ensemble Trees",
        shortDesc: "Extreme gradient boosting algorithm winning top competitive tabular benchmarks.",
        highlight: "Parallel Tree Boosting",
        order: 21,
    },
    {
        id: "pytorch",
        name: "PyTorch",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
        domain: "ai-ml",
        category: "Deep Learning",
        categoryLabel: "Deep Learning",
        badge: "Dynamic Tensors",
        shortDesc: "Leading research & production deep learning framework with dynamic computational graphs.",
        highlight: "Autograd & GPU Acceleration",
        order: 22,
    },
    {
        id: "tensorflow",
        name: "TensorFlow",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
        domain: "ai-ml",
        category: "Deep Learning",
        categoryLabel: "Deep Learning",
        badge: "Enterprise AI",
        shortDesc: "End-to-end open source platform for machine learning and model deployment.",
        highlight: "TF Serving & TensorBoard",
        order: 23,
    },
    {
        id: "keras",
        name: "Keras",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg",
        domain: "ai-ml",
        category: "Deep Learning",
        categoryLabel: "Neural Networks",
        badge: "Deep Neural Nets",
        shortDesc: "High-level neural networks API running seamlessly on top of PyTorch and TensorFlow.",
        highlight: "Rapid Model Prototyping",
        order: 24,
    },
    {
        id: "opencv",
        name: "OpenCV / CNN",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
        domain: "ai-ml",
        category: "Computer Vision",
        categoryLabel: "Vision & CNNs",
        badge: "Computer Vision",
        shortDesc: "Real-time computer vision, object detection, segmentation, and YOLO CNNs.",
        highlight: "Real-Time Image Processing",
        order: 25,
    },
    {
        id: "openai",
        name: "OpenAI / LLMs",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg",
        domain: "ai-ml",
        category: "NLP & GenAI",
        categoryLabel: "Generative AI",
        badge: "GPT & Embeddings",
        shortDesc: "Frontier foundation models, vector embeddings, function calling, and RAG agents.",
        highlight: "RAG & Autonomous Agents",
        invertInDark: true,
        order: 26,
    },
    {
        id: "fastapi",
        name: "FastAPI",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
        domain: "ai-ml",
        category: "AI Inference & APIs",
        categoryLabel: "AI Microservices",
        badge: "Inference Engine",
        shortDesc: "Lightning-fast async Python web framework designed for model inference endpoints.",
        highlight: "Async Model Serving",
        order: 27,
    },
    {
        id: "docker",
        name: "Docker MLOps",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        domain: "ai-ml",
        category: "MLOps & Deploy",
        categoryLabel: "Containerized AI",
        badge: "Containerization",
        shortDesc: "Reproducible container pipelines for model training and cloud deployment.",
        highlight: "Zero Drift Environments",
        order: 28,
    },

    // 3. Mobile Native Stack
    {
        id: "jetpack-compose",
        name: "Jetpack Compose",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetpackcompose/jetpackcompose-original.svg",
        domain: "mobile",
        category: "Android UI",
        categoryLabel: "Modern Android UI",
        badge: "Declarative UI",
        shortDesc: "Android modern declarative UI toolkit with reactive state composition.",
        highlight: "Material 3 & Recomposition",
        order: 40,
    },
    {
        id: "kotlin",
        name: "Kotlin",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
        domain: "mobile",
        category: "Core Language",
        categoryLabel: "Native & KMP",
        badge: "Modern Android",
        shortDesc: "Official Android development language with null-safety and multiplatform capability.",
        highlight: "Coroutines & Extension Functions",
        order: 41,
    },
    {
        id: "java",
        name: "Java",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        domain: "mobile",
        category: "Core Language",
        categoryLabel: "Enterprise Native",
        badge: "JVM Standard",
        shortDesc: "Robust object-oriented programming foundation powering Android and enterprise SDKs.",
        highlight: "JVM Bytecode & Concurrency",
        order: 42,
    },
    {
        id: "xml",
        name: "XML Layouts",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xml/xml-original.svg",
        domain: "mobile",
        category: "UI Architecture",
        categoryLabel: "View System",
        badge: "View System",
        shortDesc: "Classic Android declarative UI system with ConstraintLayout and ViewBinding.",
        highlight: "ConstraintLayout & DataBinding",
        order: 43,
    },
    {
        id: "coroutines-flow",
        name: "Coroutines / Flow",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
        domain: "mobile",
        category: "Async & Reactive",
        categoryLabel: "Reactive Concurrency",
        badge: "StateFlow / SharedFlow",
        shortDesc: "Lightweight structured concurrency and cold/hot streams for smooth 120fps UI.",
        highlight: "Non-blocking Background Work",
        order: 44,
    },
    {
        id: "mvvm-mvi",
        name: "MVVM / MVI",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
        domain: "mobile",
        category: "Architecture Pattern",
        categoryLabel: "Clean Architecture",
        badge: "Unidirectional State",
        shortDesc: "Unidirectional data flow, ViewModel state holders, and clean separation.",
        highlight: "Single Source of Truth",
        order: 45,
    },
    {
        id: "flutter",
        name: "Flutter",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
        domain: "mobile",
        category: "Cross-Platform",
        categoryLabel: "Cross-Platform",
        badge: "Cross-Platform",
        shortDesc: "High-performance multi-platform UI framework with Skia rendering engine.",
        highlight: "Cross-Platform Velocity",
        order: 46,
    },
    {
        id: "react-native",
        name: "React Native",
        svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        domain: "mobile",
        category: "Mobile Native",
        categoryLabel: "Cross-Platform",
        badge: "Cross-Platform",
        shortDesc: "Native mobile applications powered by React and JavaScript bridge/Fabric.",
        highlight: "React Architecture",
        order: 47,
    },
];

// Helper: Ensure initial standard technologies exist in database
const ensureInitialSeed = async () => {
    try {
        const count = await TechStack.countDocuments();
        if (count === 0) {
            await TechStack.insertMany(defaultTechItems);
            console.log(`[TechStack] Auto-seeded ${defaultTechItems.length} technologies`);
        }
    } catch (err) {
        console.error('[TechStack] Auto-seed failed:', err.message);
    }
};

// GET all technologies
exports.getAllTechnologies = async (req, res) => {
    try {
        const cacheKey = `techstack_${JSON.stringify(req.query)}`;
        const cached = memoryCache.get(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        await ensureInitialSeed();

        const { domain, category, search, activeOnly = 'true' } = req.query;
        const filter = {};

        if (activeOnly === 'true') {
            filter.isActive = { $ne: false };
        }

        if (domain && domain !== 'all') {
            filter.domain = domain;
        }

        if (category) {
            filter.category = new RegExp(category, 'i');
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { name: searchRegex },
                { badge: searchRegex },
                { category: searchRegex },
                { categoryLabel: searchRegex },
                { shortDesc: searchRegex },
            ];
        }

        const items = await TechStack.find(filter).sort({ order: 1, createdAt: 1 }).lean();

        const mapped = items.map((t) => ({
            ...t,
            techId: t.id || t._id.toString(),
        }));

        const responsePayload = {
            success: true,
            count: mapped.length,
            data: mapped,
        };

        memoryCache.set(cacheKey, responsePayload, 120);

        return res.status(200).json(responsePayload);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch technologies',
        });
    }
};

// GET single technology by ID or slug
exports.getTechnologyById = async (req, res) => {
    try {
        const { id } = req.params;
        let item = null;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            item = await TechStack.findById(id);
        }

        if (!item) {
            item = await TechStack.findOne({ id });
        }

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Technology item not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch technology',
        });
    }
};

// POST create new technology
exports.createTechnology = async (req, res) => {
    try {
        const {
            id,
            name,
            svgUrl,
            domain = 'software',
            category = 'general',
            categoryLabel = '',
            badge = '',
            shortDesc = '',
            highlight = '',
            invertInDark = false,
            order = 0,
            isActive = true,
        } = req.body;

        if (!name || !svgUrl) {
            return res.status(400).json({
                success: false,
                message: 'Name and svgUrl are required',
            });
        }

        const generatedId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const newItem = new TechStack({
            id: generatedId,
            name,
            svgUrl,
            domain,
            category,
            categoryLabel: categoryLabel || category,
            badge,
            shortDesc,
            highlight,
            invertInDark: Boolean(invertInDark),
            order: Number(order) || 0,
            isActive: isActive !== false,
        });

        const saved = await newItem.save();

        return res.status(201).json({
            success: true,
            message: 'Technology added successfully',
            data: saved,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create technology',
        });
    }
};

// POST bulk add technologies
exports.bulkAddTechnologies = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items array is required for bulk add',
            });
        }

        const inserted = await TechStack.insertMany(items);
        memoryCache.invalidatePrefix('techstack');

        return res.status(201).json({
            success: true,
            count: inserted.length,
            message: `Successfully added ${inserted.length} technologies`,
            data: inserted,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Bulk insert failed',
        });
    }
};

// PUT / PATCH update technology
exports.updateTechnology = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await TechStack.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Technology not found',
            });
        }

        memoryCache.invalidatePrefix('techstack');

        return res.status(200).json({
            success: true,
            message: 'Technology updated successfully',
            data: updated,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update technology',
        });
    }
};

// DELETE technology
exports.deleteTechnology = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TechStack.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Technology not found',
            });
        }

        memoryCache.invalidatePrefix('techstack');

        return res.status(200).json({
            success: true,
            message: 'Technology deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete technology',
        });
    }
};

// POST reset / seed standard technologies
exports.seedTechnologies = async (req, res) => {
    try {
        await TechStack.deleteMany({});
        const seeded = await TechStack.insertMany(defaultTechItems);
        memoryCache.invalidatePrefix('techstack');

        return res.status(200).json({
            success: true,
            count: seeded.length,
            message: `Successfully seeded ${seeded.length} technologies`,
            data: seeded,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to seed technologies',
        });
    }
};
