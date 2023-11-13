const jwt = require('jsonwebtoken');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const Cart = require('../../model/cart');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');
const dotenv = require('dotenv');
dotenv.config();


// const createCartItems = catchAsyncError(async (req, res, next) => {
//     try {
//         const { items } = req.body;
//         if (!Array.isArray(items) || items.length === 0) {
//             return next(new ErrorHandler('Invalid items data', 400));
//         }
//         const decodedToken = jwt.verify(req.cookies.token, process.env.JSON_WEB_TOKEN_SECRECT);
//         const userToken = decodedToken.id;
//         let cart = await Cart.findOne({ user: userToken || 'defaultUserId' });
        
//         if (!cart) {
//             cart = await Cart.create({
//                 user: userToken || 'defaultUserId',
//                 items: [],
//             });   
//         }
//         const authToken = jwt.sign({ id: userToken }, process.env.JSON_WEB_TOKEN_SECRECT, {
//             expiresIn: process.env.JSON_WEB_TOKEN_EXPIRE_DATE,
//           });
//         res.cookie('token', authToken, {     
//             // other options
//             sameSite: 'None',
//             secure: true, // set to true in production for HTTPS
//           }); 
//         for (const item of items) {
//             const existingItem = cart.items.find(cartItem => cartItem.item.equals(item.id));

//             if (!existingItem) {
//                 cart.items.push({ item: item.id, price: item.price });
//             } else {
//                 existingItem.price = item.price;
//             }
//         }
//         await cart.save();

//         const successResponse = new SuccessHandler('Item(s) added successfully', cart);
//         successResponse.sendResponse(res, 201);

//     } catch (error) {
//         next(new ErrorHandler(error.message, 500));
//     }
// });

// module.exports = createCartItems;

const createCartItems = catchAsyncError(async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { price } = req.body;
        if (!itemId || !price) {
            return next(new ErrorHandler('Item ID and price is required', 400));
        }

        const decodedToken = jwt.verify(req.cookies.token, process.env.JSON_WEB_TOKEN_SECRECT);
        const userToken = decodedToken.id;
        let cart = await Cart.findOne({ user: userToken || 'defaultUserId' });
        
        if (!cart) {
            cart = await Cart.create({
                user: userToken || 'defaultUserId',
                items: [],
            });   
        }
        
        const existingItem = cart.items.find(cartItem => cartItem.item.equals(itemId));

        if (!existingItem) {
            // Assuming you have the item details (like price) available
            const newItem = { item: itemId , price: price};
            cart.items.push(newItem);
            await cart.save();

            const successResponse = new SuccessHandler('Item added successfully', cart);
            successResponse.sendResponse(res, 201);
        } else {
            return next(new ErrorHandler('Item already exists in the cart', 400));
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});
module.exports = createCartItems;