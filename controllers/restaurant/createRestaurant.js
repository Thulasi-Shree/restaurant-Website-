// const catchAsyncError = require('../../middlewares/catchAsyncError');
// const Restaurant = require('../../model/restaurant');
// const ErrorHandler = require('../../utils/errorHandler');
// const SuccessHandler = require('../../utils/successHandler');

// const createRestaurant = catchAsyncError(async (req, res, next) => {
//     try {
//         const { name, branch,
//             pincode, images, restaurantId, description, location, openingHours } = req.body;
//         const userId = req.user.id

//         const existingRestaurant = await Restaurant.findOne({ restaurantId });
//         if (existingRestaurant) {
//             return next(new ErrorHandler('Duplicate restaurant ID', 400));
//         }

//         // Create a new restaurant object
//         const newRestaurant = new Restaurant({
//             name,
//             branch,
//             pincode,
//             restaurantId,
//             images,
//             description,
//             location,
//             openingHours,
//             createdBy: userId,
//             dietaryPreferenceCategory,
//             cuisineTypeCategory
//         });

//         // Save the new restaurant
//         await newRestaurant.save();

//         const successResponse = new SuccessHandler('Restaurant created successfully', newRestaurant);
//         successResponse.sendResponse(res, 201);
//     } catch (error) {
       
//              console.error(error);
//         next(new ErrorHandler('Internal Server Error', 500));
 
       
//     }
// });

// module.exports = createRestaurant;

const catchAsyncError = require('../../middlewares/catchAsyncError');
const Restaurant = require('../../model/restaurant');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createRestaurant = catchAsyncError(async (req, res, next) => {
    try {
        const { restaurantName, pincode, images, restaurantId, description, branch, openingHours, cuisineTypeCategory, dietaryPreferenceCategory } = req.body;
        const userId = req.user.id;

        // Create a new restaurant object
        const newRestaurant = await Restaurant.create({
            restaurantName,
            pincode,
            branch,
            restaurantId,
            images,
            description,
            openingHours,
            createdBy: userId,
            dietaryPreferenceCategory,
            cuisineTypeCategory
        });

        const successResponse = new SuccessHandler('Restaurant created successfully', newRestaurant);
        successResponse.sendResponse(res, 201);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = createRestaurant;
