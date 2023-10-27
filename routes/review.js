const express = require('express');
const createReview = require('../controllers/review/createReview');
const  getReviews = require('../controllers/review/getReview') 
const  deleteReview = require('../controllers/review/deleteReview')
const editReview = require('../controllers/review/updateReview')
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

            
        

router.route('/review/:token/:id').post(isAuthenticatedUser,authorizeRoles('user'), createReview)
                      
//Admin routes

router.route('/review/:token/:reviewId').delete(isAuthenticatedUser, deleteReview)
router.route('/review/:productId').get(isAuthenticatedUser, getReviews)
router.route('/review/:userId/:reviewId').put(isAuthenticatedUser, editReview);
module.exports = router;