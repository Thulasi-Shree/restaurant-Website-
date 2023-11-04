const catchAsyncError = require('../../middlewares/catchAsyncError');
const Order = require('../../model/order');
const ErrorHandler = require('../../utils/errorHandler');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../../utils/email');

exports.newOrder = async (req, res) => {
    try {
        const restaurantId = req.body.restaurantId.toString();
        const {
            orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            pickup,
        } = req.body;

        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            pickup,
            restaurantId,
            paidAt: Date.now(),
            user: req.user.id
        });
        await order.populate('user', 'name email phone');

        sendOrderConfirmationEmail(order.user.email, order);

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
        await order.populate('user', 'name email phone');
        sendOrderStatusUpdateEmail(order.user.email, order);

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
        const order = await Order.findById(req.params.id).populate('user', 'name email phone').populate('shippingInfo', 'street city state postalCode country');
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
        const orders = await Order.find();
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
