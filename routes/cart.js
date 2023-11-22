const express = require('express');
const router = express.Router();
const getCartItems = require('../controllers/cart/getCartItems');
const getCartItem = require('../controllers/cart/getCartItems');
const createCartItems = require('../controllers/cart/createCartItems');
const updateCartItems = require('../controllers/cart/updateCartItems');
const deleteCartItems = require('../controllers/cart/deleteCartItems');
const deleteEntireCart = require('../controllers/cart/deleteCart')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');


// Create Cart Items: POST /api/item/new (Private - User role required)
router.route('/cart/create/:itemId').post(isAuthenticatedUser, createCartItems); //authorizeRoles('user'), isAuthenticatedUser,

// Get Cart Items: GET /api/items (Private - User role required)
router.route('/item/:cartId').get(isAuthenticatedUser, getCartItems);  //  authorizeRoles('user'),

// Get Cart Items: GET /api/item (Private - User role required)
router.route('/item/:id').get(isAuthenticatedUser, getCartItem);

// Get Single Cart Items: GET /api/items (Private - User role required)
router.route('/items/:userId').get(isAuthenticatedUser, getCartItems);  //  authorizeRoles('user'),

// Delete Entire Cart: DELETE /api/items/delete (Private - User role required)
router.route('/items/delete').delete(isAuthenticatedUser, authorizeRoles('user'), deleteEntireCart);

// Update Cart Items by ID: PUT /api/item/edit/:id (Private - User role required)
router.route('/item/edit/:id').put(isAuthenticatedUser, updateCartItems); //authorizeRoles('user'), 

// Delete Cart Items by Item ID: DELETE /api/item/delete/:itemId (Private - User role required)   
router.route('/item/delete/:itemId').delete(isAuthenticatedUser,  deleteCartItems);//authorizeRoles('user'),




module.exports = router;