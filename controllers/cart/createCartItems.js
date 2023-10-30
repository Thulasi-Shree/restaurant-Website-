const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createCartItems = catchAsyncError(async (req, res, next) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return next(new ErrorHandler('Invalid items data', 400));
        }
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [],
            });
        }
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