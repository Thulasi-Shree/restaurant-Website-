const express = require('express');
const router = express.Router();
const {
    createUserActivity,
    getAllUserActivities,
    getUserActivityById,
    updateUserActivity,
    deleteUserActivity
} = require('../controllers/userActivity/userActivity');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.route('/activity').post(isAuthenticatedUser, createUserActivity);
router.route('/activities').get(isAuthenticatedUser, getAllUserActivities);
router.route('/activity/:id').get(isAuthenticatedUser, getUserActivityById);
router.route('/activity/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateUserActivity);
router.route('/activity/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUserActivity);

module.exports = router;
