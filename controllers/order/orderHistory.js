const catchAsyncError = require('../../middlewares/catchAsyncError');
const Order = require('../../model/order');
const ErrorHandler = require('../../utils/errorHandler');

const getActiveOrdersByBranch = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.params.restaurantId;
        const activeOrders = await Order.find({ 
            restaurantId: restaurantId,
            orderStatus: { $nin: 'Delivered'} 
        }).populate('user', 'orderItems.product ');

        res.status(200).json(activeOrders);
    } catch (error) {
        next(new ErrorHandler(500, 'Internal Server Error'));
    }
});

const getNonActiveOrdersByBranch = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.params.restaurantId;
        const nonActiveOrders = await Order.find({  
            restaurantId: restaurantId, 
            orderStatus: { $in: 'Delivered' } 
        }).populate('user', 'orderItems.product');

        res.status(200).json(nonActiveOrders);
    } catch (error) {
        next(new ErrorHandler(500, 'Internal Server Error'));
    }
});

module.exports = {
    getActiveOrdersByBranch,
    getNonActiveOrdersByBranch
};