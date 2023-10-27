const express = require('express');
const router = express.Router();
const getAllFeedBack = require('../controllers/feedBack/getAllFeedback');
const createFeedBack = require('../controllers/feedBack/createFeedBack');
const getSingleFeedBack = require('../controllers/feedBack/getSingleFeedback');
const deleteFeedBack = require('../controllers/feedBack/deleteFeedback');
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');



router.route('/feedback/new').post(isAuthenticatedUser, authorizeRoles('user'), createFeedBack);
router.route('/feedback').get(isAuthenticatedUser, authorizeRoles('admin'), getAllFeedBack);
router.route('/feedback/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getSingleFeedBack);
router.route('/feedback/delete/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteFeedBack);



module.exports = router;