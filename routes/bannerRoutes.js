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

// Routes
bannerRoutes.get('/', getAllBanners);
bannerRoutes.get('/page/:pageType', pageTypeParamRules, validate, getBannerByPageType);
bannerRoutes.post('/add-banner', uploadBanner.any(), createBannerRules, validate, createBanner);
bannerRoutes.post('/', uploadBanner.any(), createBannerRules, validate, createBanner);
bannerRoutes.put('/update-banner/:id', uploadBanner.any(), [...bannerIdParamRules, ...updateBannerRules], validate, updateBanner);
bannerRoutes.put('/:id', uploadBanner.any(), [...bannerIdParamRules, ...updateBannerRules], validate, updateBanner);
bannerRoutes.delete('/delete-banner/:id', bannerIdParamRules, validate, deleteBanner);
bannerRoutes.delete('/:id', bannerIdParamRules, validate, deleteBanner);

module.exports = bannerRoutes;