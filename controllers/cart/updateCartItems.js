const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const updateCartItem = catchAsyncError(async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const { itemId, itemQuantity } = req.body; 

        const cart = await Cart.findById(cartId);

        if (typeof itemQuantity !== 'number' || itemQuantity <= 0 || !Number.isInteger(itemQuantity)) {
            return next(new ErrorHandler('Invalid item quantity', 400));
        }

        if (!cart) {
            return next(new ErrorHandler('Cart not found', 404));
        }

        const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);

        if (itemIndex === -1) {
            return next(new ErrorHandler('Item not found in the cart', 404));
        }

        cart.items[itemIndex].itemQuantity = itemQuantity;

        await cart.save();

        const successResponse = new SuccessHandler('Item quantity updated successfully', cart);
        successResponse.sendResponse(res, 200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(new ErrorHandler(error.message, 400));
        }
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = updateCartItem;
