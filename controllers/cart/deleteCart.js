const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const deleteEntireCart = catchAsyncError(async (req, res, next) => {
    try {
        // Find and delete the user's entire cart
        await Cart.findOneAndDelete({ user: req.user.id });

        const successResponse = new SuccessHandler('Entire cart deleted successfully', {});
        successResponse.sendResponse(res, 200);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = deleteEntireCart;
