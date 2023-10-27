const express = require('express');
const router = express.Router();
const getAllAddress = require('../controllers/address/getAllAddress');
const createAddress = require('../controllers/address/createAddress');
const updateAddress = require('../controllers/address/updateAddress');
const deleteAddress = require('../controllers/address/deleteAddress');
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');



router.route('/address/new').post(isAuthenticatedUser, authorizeRoles('user'), createAddress);
router.route('/address').get(isAuthenticatedUser, authorizeRoles('admin'), getAllAddress);
router.route('/address/edit/:id').put(isAuthenticatedUser, authorizeRoles('user'), updateAddress);
router.route('/address/delete/:id').delete(isAuthenticatedUser, authorizeRoles('user'), deleteAddress);



module.exports = router;