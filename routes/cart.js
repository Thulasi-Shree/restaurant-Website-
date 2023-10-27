const express = require('express');
const router = express.Router();
const getCartItems = require('../controllers/cart/getCartItems');
const createCartItems = require('../controllers/cart/createCartItems');
const updateCartItems = require('../controllers/cart/updateCartItems');
const deleteCartItems = require('../controllers/cart/deleteCartItems');
const deleteEntireCart = require('../controllers/cart/deleteCart')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');



router.route('/item/new').post(isAuthenticatedUser, authorizeRoles('user'), createCartItems);
router.route('/items').get(isAuthenticatedUser, authorizeRoles('user'), getCartItems);
router.route('/items/delete').delete(isAuthenticatedUser, authorizeRoles('user'), deleteEntireCart);
router.route('/item/edit/:id').put(isAuthenticatedUser, authorizeRoles('user'), updateCartItems);
router.route('/item/delete/:itemId').delete(isAuthenticatedUser, authorizeRoles('user'), deleteCartItems);



module.exports = router;