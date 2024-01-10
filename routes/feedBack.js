const express = require('express');
const router = express.Router();
const getAllFeedBack = require('../controllers/feedBack/getAllFeedback');
const createFeedBack = require('../controllers/feedBack/createFeedBack');
const getSingleFeedBack = require('../controllers/feedBack/getSingleFeedback');
const deleteFeedBack = require('../controllers/feedBack/deleteFeedback');
const {contactUs} = require('../controllers/feedBack/ContactUs')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');


// Create New Feedback: POST /api/feedback/new (Private - User role required)
router.route('/feedback/new').post(isAuthenticatedUser, authorizeRoles('user'), createFeedBack);
router.route('/send-email').post(contactUs);

// Get All Feedback: GET /api/feedback (Private - Admin role required)
router.route('/feedback').get(isAuthenticatedUser, authorizeRoles('admin'), getAllFeedBack);

// Get Single Feedback by ID: GET /api/feedback/:id (Private - Admin role required)
router.route('/feedback/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getSingleFeedBack);

// Delete Feedback by ID: DELETE /api/feedback/delete/:id (Private - Admin role required)
router.route('/feedback/delete/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteFeedBack);




module.exports = router;