const express = require('express');
const createReview = require('../controllers/review/createReview');
const  getReviews = require('../controllers/review/getReview') 
const  deleteReview = require('../controllers/review/deleteReview')
const editReview = require('../controllers/review/updateReview')
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

            
        
// Create Review for a Product: POST /api/review/:token/:id (User role required)
router.route('/review/:token/:id').post(isAuthenticatedUser, authorizeRoles('user'), createReview);

// Admin Routes

// Delete Review by Review ID: DELETE /api/review/:token/:reviewId (Admin role required)
router.route('/review/:token/:reviewId').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteReview);

// Get Reviews for a Product: GET /api/review/:productId 
router.route('/review/:productId').get(isAuthenticatedUser, getReviews);

// Edit Review by User ID and Review ID: PUT /api/review/:userId/:reviewId 
router.route('/review/:userId/:reviewId').put(isAuthenticatedUser, editReview);


module.exports = router;