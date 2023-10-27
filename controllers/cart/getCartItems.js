const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');
const Product = require('../../model/menuItem');

const Order = require('../../model/order');


const getCartItems = catchAsyncError(async (req, res, next) => {
        const orders = await Cart.find();
    
        let totalAmount = 0;
    
        orders.forEach(order => {
            totalAmount += order.totalPrice
        })
    
        res.status(200).json({
            success: true,
            totalAmount,
            orders
        })
    })

module.exports = getCartItems


















// const catchAsyncError = require('../../middlewares/catchAsyncError');
// const Cart = require('../../model/cart');
// const ErrorHandler = require('../../utils/errorHandler');
// const SuccessHandler = require('../../utils/successHandler');

// const getCartItems = catchAsyncError(async (req, res, next) => {
//     try {
//         const userId = req.user.id;
//         const cart = await Cart.findOne({ user: userId }).populate('items.product');

//         if (!cart) {
//             return next(new ErrorHandler('Cart not found', 404));
//         }
//         cart.totalPrice = calculateTotalPrice(cart.items);
//         await cart.save();

//         const successResponse = new SuccessHandler('Cart items retrieved successfully', cart);
//         successResponse.sendResponse(res);

//     } catch (error) {
//         next(new ErrorHandler('Internal Server Error', 500));
//     }
// });

// function calculateTotalPrice(items, region) {
//     let total = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

//     let taxRate;
//     if (region === 'middleEast') {
//         taxRate = 0.1;
//     } else if (region === 'america') {
//         taxRate = 0.08;
//     } else {
//         taxRate = 0;
//     }

//     const tax = total * taxRate;
//     total += tax;

//     return total;
// }

// module.exports = getCartItems;
