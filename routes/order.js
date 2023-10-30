const express = require('express');
const { newOrder, getSingleOrder, myOrders, orders, updateOrderStatus, deleteOrder } = require('../controllers/order/order');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Admin Routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), orders)
router.route('/admin/order/:id').patch(isAuthenticatedUser,  updateOrderStatus)
                        .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)

module.exports = router;