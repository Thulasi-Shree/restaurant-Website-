const catchAsyncError = require('../../middlewares/catchAsyncError');
const Restaurant = require('../../model/restaurant'); // Correct the import path if it's not 'user'
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const getRestaurant = catchAsyncError(async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find();

        if (!restaurants || restaurants.length === 0) {
            return next(new ErrorHandler('No restaurants found', 404));
        }

        const successResponse = new SuccessHandler('Restaurants retrieved successfully', restaurants);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = getRestaurant