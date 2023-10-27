const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createCartItems = catchAsyncError(async (req, res, next) => {
    try {
        const { items } = req.body;
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [],
            });
        }
        // Check if items with the same itemId already exist in the cart
        for (const item of items) {
            const existingItem = cart.items.find(cartItem => cartItem.item.equals(item.itemId));

            if (!existingItem) {
                cart.items.push({ item: item.itemId, itemPrice: item.itemPrice });
            } else {
                existingItem.itemPrice = item.itemPrice;
            }
        }
        await cart.save();

        const successResponse = new SuccessHandler('Item(s) added successfully', cart);
        successResponse.sendResponse(res, 201);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = createCartItems;