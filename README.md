# ⚙️ Programming Bridge — Backend REST API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email_Service-007ACC?style=for-the-badge&logo=maildotru&logoColor=white)

**The official backend REST API engine powering the Programming Bridge digital studio platform.**

[Frontend App Repo](https://github.com/Programming-Bridge/frontend_pb) • [Live Platform](https://programmingbridge.com) • [Contact Support](mailto:contact@programmingbridge.com)

</div>

---

## 📌 Overview

**Programming Bridge Backend** is a production-grade, high-throughput REST API built on **Node.js**, **Express 5**, and **MongoDB (Mongoose)**. It provides dynamic content management, lead generation handling, automated email alerts, job board workflows with Cloudinary/Multer resume uploads, and in-memory caching for sub-millisecond query delivery.

---

## ✨ Core Features & Architecture

- ⚡ **Express 5 & Gzip Compression:** Ultra-fast HTTP request handling with level 6 gzip payload compression.
- 🗄️ **MongoDB & Mongoose Schema Modeling:** Structured schema design with indexing and query optimization.
- 🚀 **In-Memory Cache Layer:** Custom TTL-based caching utility for high-read endpoints (Banners, Services, Tech Stack, Projects).
- 📁 **Cloudinary & Multer File Uploads:** Secure storage and URL generation for job candidate resumes and media assets.
- 📧 **Automated Email Notifications:** Nodemailer integration for instantaneous inquiry receipts and application alerts.
- 🛡️ **Validation & Error Handling:** `express-validator` middleware rules and centralized global error handling.
- 🔒 **CORS & Security Standards:** Configured Cross-Origin Resource Sharing with production headers.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) (v18+ / v20+) |
| **Framework** | [Express 5](https://expressjs.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **File Storage** | [Multer](https://github.com/expressjs/multer) & [Cloudinary SDK](https://cloudinary.com/) |
| **Email Service** | [Nodemailer](https://nodemailer.com/) |
| **Validation** | [express-validator](https://express-validator.github.io/docs/) |
| **Compression** | [compression](https://github.com/expressjs/compression) |

---

## 📁 Directory Structure

```text
backend_pb/
├── config/
│   └── db.js                    # MongoDB Connection Handler
├── controller/
│   ├── application.controller.js # Job Application & Resume Processing
│   ├── banner.controller.js      # Hero Banner CRUD & Ordering
│   ├── career.controller.js      # Open Positions & Job Postings
│   ├── inquiry.controller.js     # Contact & Quotation Form Submissions
│   ├── navbar.controller.js      # Navigation Links Management
│   ├── project.controller.js     # Portfolio & Case Studies CRUD
│   ├── serviceCard.controller.js # Service Cards & Capabilities
│   ├── team.controller.js        # Team Members & Bios
│   └── techStack.controller.js   # Tech Stack Matrix & Categories
├── middlewares/
│   └── upload.middleware.js     # Multer & Cloudinary Storage Config
├── model/                       # Mongoose Schemas & Data Models
├── routes/                      # Express Route Declarations
├── utils/
│   ├── cache.util.js            # In-Memory TTL Cache Utility
│   └── mailer.util.js           # Email Dispatch Service
├── validations/                 # express-validator Rules
├── index.js                     # Main Application Entry Point
└── package.json                 # Dependencies and Scripts
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/banner` | Retrieve all active Hero Carousel banners |
| `GET` | `/api/services` | Retrieve active service capability cards |
| `GET` | `/api/projects` | Retrieve featured client projects & case studies |
| `GET` | `/api/tech-stack` | Get complete technologies matrix by category |
| `GET` | `/api/careers` | List all open job opportunities |
| `POST` | `/api/applications` | Submit job application with PDF/Doc resume upload |
| `POST` | `/api/inquiries` | Submit client inquiry / project quotation request |
| `GET` | `/api/team` | List agency team members and leadership |
| `GET` | `/api/navbar` | Retrieve dynamic navigation items |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Cloudinary Account**: Cloud name, API Key, API Secret

### 2. Clone the Repository
```bash
git clone https://github.com/Programming-Bridge/backend_pb.git
cd backend_pb
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of `backend_pb/`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/programming_bridge?retryWrites=true&w=majority

# Cloudinary Credentials (For Resumes & Media)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_NOTIFICATION_EMAIL=contact@programmingbridge.com
```

### 5. Run Server

**Development Mode (with hot reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server will run at `http://localhost:5000`.

---

## 🔗 Connected Frontend

This API serves the **Programming Bridge Frontend Application**:
- **Frontend Repo:** [Programming-Bridge/frontend_pb](https://github.com/Programming-Bridge/frontend_pb)

---

## 📄 License & Ownership

© 2026 **Programming Bridge Agency**. All Rights Reserved.  
Unauthorized copying or distribution of these files is strictly prohibited.
