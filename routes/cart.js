const express = require('express');
const router = express.Router();
const getCartItems = require('../controllers/cart/getCartItems');
const createCartItems = require('../controllers/cart/createCartItems');
const updateCartItems = require('../controllers/cart/updateCartItems');
const deleteCartItems = require('../controllers/cart/deleteCartItems');
const deleteEntireCart = require('../controllers/cart/deleteCart')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');


// Create Cart Items: POST /api/item/new (Private - User role required)
router.route('/item/new').post(isAuthenticatedUser, authorizeRoles('user'), createCartItems);

// Get Cart Items: GET /api/items (Private - User role required)
router.route('/items').get(isAuthenticatedUser, authorizeRoles('user'), getCartItems);

// Delete Entire Cart: DELETE /api/items/delete (Private - User role required)
router.route('/items/delete').delete(isAuthenticatedUser, authorizeRoles('user'), deleteEntireCart);

// Update Cart Items by ID: PUT /api/item/edit/:id (Private - User role required)
router.route('/item/edit/:id').put(isAuthenticatedUser, authorizeRoles('user'), updateCartItems);

// Delete Cart Items by Item ID: DELETE /api/item/delete/:itemId (Private - User role required)
router.route('/item/delete/:itemId').delete(isAuthenticatedUser, authorizeRoles('user'), deleteCartItems);




module.exports = router;