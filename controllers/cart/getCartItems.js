// const catchAsyncError = require('../../middlewares/catchAsyncError');
// const Cart = require('../../model/cart');
// const ErrorHandler = require('../../utils/errorHandler');

// const getCartItems = catchAsyncError(async (req, res, next) => {
//     try {
//         const cartItems = await Cart.find().populate('items.item', 'name price itemQuantity');

//         let totalAmount = 0;

//         cartItems.forEach(cart => {
//             cart.items.forEach(item => {
//                 totalAmount += item.itemPrice * item.itemQuantity;
//             });
//         });

//         res.status(200).json({
//             success: true,
//             totalAmount,
//             cartItems
//         });
//     } catch (error) {
//         console.error(error);
//         next(new ErrorHandler('Internal Server Error', 500));
//     }
// });

// module.exports = getCartItems;

const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');

const getCartItems = catchAsyncError(async (req, res, next) => {
    try {
        const cartId = req.params.cartId;
        const cartItems = await Cart.findById(cartId).populate('items.item', 'name price itemQuantity');

        if (!cartItems) {
            return next(new ErrorHandler('Cart not found', 404));
        }

        // Ensure that cartItems.items is an array
        cartItems.items = Array.isArray(cartItems.items) ? cartItems.items : [];

        let totalAmount = 0;

        cartItems.items.forEach(item => {
            totalAmount += item.itemPrice * item.itemQuantity;
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

