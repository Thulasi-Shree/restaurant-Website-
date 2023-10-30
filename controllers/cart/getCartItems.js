const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');

const getCartItems = catchAsyncError(async (req, res, next) => {
    try {
        const cartItems = await Cart.find();

        let totalAmount = 0;

        cartItems.forEach(cart => {
            cart.items.forEach(item => {
                totalAmount += item.itemPrice * item.itemQuantity;
            });
        });

        res.status(200).json({
            success: true,
            totalAmount,
            cartItems
        });
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = getCartItems;
