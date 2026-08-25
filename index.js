const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const cors = require('cors');
const dbConnection = require('./config/db');
const navbarRoutes = require('./routes/navbarRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const serviceSlideRoutes = require('./routes/serviceSlideRoutes');
const serviceCardRoutes = require('./routes/serviceCardRoutes');
const projectRoutes = require('./routes/projectRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const techStackRoutes = require('./routes/techStackRoutes');
const teamRoutes = require('./routes/teamRoutes');
const careerRoutes = require('./routes/careerRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const compression = require('compression');

dbConnection();

const app = express();

// High-performance gzip response compression
app.use(compression({
    level: 6,
    threshold: 1024, // Compress responses above 1KB
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// High-performance static cache headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d',
    etag: true,
}));

// Routes
app.use('/api/navbar', navbarRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/slides', serviceSlideRoutes);
app.use('/api/services', serviceCardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/contact', inquiryRoutes);
app.use('/api/tech-stack', techStackRoutes);
app.use('/api/technologies', techStackRoutes);
app.use('/api/techstack', techStackRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/members', teamRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/jobs', careerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/apply', applicationRoutes);


app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
