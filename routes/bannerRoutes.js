const express = require('express');
const bannerRoutes = express.Router();
const {
    getBannerByPageType,
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controller/banner.controller');
const {
    createBannerRules,
    updateBannerRules,
    bannerIdParamRules,
    pageTypeParamRules
} = require('../validations/banner.validation');
const { uploadBanner } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Public Routes
bannerRoutes.get('/', getAllBanners);
bannerRoutes.get('/page/:pageType', pageTypeParamRules, validate, getBannerByPageType);

// Protected Mutation Routes (Admin Only)
bannerRoutes.post('/add-banner', verifyToken, isAdmin, uploadBanner.any(), createBannerRules, validate, createBanner);
bannerRoutes.post('/', verifyToken, isAdmin, uploadBanner.any(), createBannerRules, validate, createBanner);
bannerRoutes.put('/update-banner/:id', verifyToken, isAdmin, uploadBanner.any(), [...bannerIdParamRules, ...updateBannerRules], validate, updateBanner);
bannerRoutes.put('/:id', verifyToken, isAdmin, uploadBanner.any(), [...bannerIdParamRules, ...updateBannerRules], validate, updateBanner);
bannerRoutes.delete('/delete-banner/:id', verifyToken, isAdmin, bannerIdParamRules, validate, deleteBanner);
bannerRoutes.delete('/:id', verifyToken, isAdmin, bannerIdParamRules, validate, deleteBanner);

module.exports = bannerRoutes;