const catchAsyncError = require('../../middlewares/catchAsyncError');
const Order = require('../../model/order');
const Cart = require('../../model/cart');

const ErrorHandler = require('../../utils/errorHandler');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../../utils/email');

exports.newOrder = async (req, res, next) => {
    try {
        const restaurantId = req.body.restaurantId ? req.body.restaurantId.toString() : null;
        const restaurantBranch = req.body.restaurantBranch ? req.body.restaurantBranch.toString() : null;
        const {
            shipping,
            email,
            phone,
            items,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            pickup,
            user
        } = req.body;

        const order = await Order.create({
            items,
            email,
            phone,
            shipping,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            pickup,
            restaurantId, 
            restaurantBranch,    
            paidAt: Date.now(),
            user
        });
        // await order.populate('user', 'name email phone');

        sendOrderConfirmationEmail(order.shipping.email, order);
        // await Cart.findOneAndUpdate({ user: req.body }, { items: [] });

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
   
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
        // await order.populate('user', 'name email phone');
        sendOrderStatusUpdateEmail(order.shipping.email, order);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};


exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

exports.myOrders = catchAsyncError(async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

exports.orders = catchAsyncError(async (req, res, next) => {
    try {
        const orders = await Order.find( {orderStatus: { $in: 'Delivered' }} );
        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});
exports.ordersActive = catchAsyncError(async (req, res, next) => {
    try {
        const orders = await Order.find( {orderStatus: { $nin: 'Delivered' }} );
        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

exports.storeChosenPickupTime = async (req, res) => {
    try {
        const { orderId, chosenPickupTime } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { pickupTime: chosenPickupTime }, { new: true }).populate('pickupTime', 'slot');;

        res.status(200).json({ success: true, message: 'Chosen pickup time stored successfully', order });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
