const express = require('express');
const createPromotion = require('../controllers/promotion/createPromotion');
const  getAllPromotions = require('../controllers/promotion/getAllPromotions') 
const  deletePromotion = require('../controllers/promotion/deletePromotion')
const updatePromotion = require('../controllers/promotion/editPromotion')
const  getSinglePromotion = require('../controllers/promotion/getSinglePromotion')
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

            
// Create Promotion: POST /api/promotion/create (Admin role required)
router.route('/promotion/create').post(isAuthenticatedUser, authorizeRoles('admin'), createPromotion);

// Get Single Promotion by ID: GET /api/promotion/get/:id (Admin role required)
router.route('/promotion/get/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getSinglePromotion);

// Delete Promotion by ID: DELETE /api/promotion/delete/:id (Admin role required)
router.route('/promotion/delete/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deletePromotion);

// Get All Promotions: GET /api/promotions/get (Admin role required)
router.route('/promotions/get').get(isAuthenticatedUser, authorizeRoles('admin'), getAllPromotions);

// Update Promotion by ID: PUT /api/promotion/edit/:id (Admin role required)
router.route('/promotion/edit/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updatePromotion);

module.exports = router;