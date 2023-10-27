const express = require('express');
const createPromotion = require('../controllers/promotion/createPromotion');
const  getAllPromotions = require('../controllers/promotion/getAllPromotions') 
const  deletePromotion = require('../controllers/promotion/deletePromotion')
const updatePromotion = require('../controllers/promotion/editPromotion')
const  getSinglePromotion = require('../controllers/promotion/getSinglePromotion')
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

            

router.route('/promotion/create').post(isAuthenticatedUser, authorizeRoles('admin'), createPromotion)                       
router.route('/promotion/get/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getSinglePromotion)
router.route('/promotion/delete/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deletePromotion)  
router.route('/promotions/get').get(isAuthenticatedUser, authorizeRoles('admin'), getAllPromotions)
router.route('/promotion/edit/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updatePromotion);
module.exports = router;