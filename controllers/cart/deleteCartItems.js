const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const deleteCartItem = catchAsyncError(async (req, res, next) => {
    try {
        const itemId = req.params.itemId;

        // Find the user's cart
        let cart = await Cart.findOne({ user: req.user.id });

        // If the user doesn't have a cart, return an error
        if (!cart) {
            return next(new ErrorHandler('Cart not found', 404));
        }

        // Find the index of the item to be deleted in the cart.items array
        const itemIndex = cart.items.findIndex(cartItem => cartItem.item.equals(itemId));

        // If the item is not found in the cart, return an error
        if (itemIndex === -1) {
            return next(new ErrorHandler('Item not found in the cart', 404));
        }

        // Remove the item from the cart.items array
        cart.items.splice(itemIndex, 1);

        // Save the updated cart
        await cart.save();

        const successResponse = new SuccessHandler('Item removed from the cart successfully', cart);
        successResponse.sendResponse(res, 200);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = deleteCartItem;
