const catchAsyncError = require('../../middlewares/catchAsyncError');
const Restaurant = require('../../model/restaurant'); // Adjust the import path if necessary
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const updateRestaurant = catchAsyncError(async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, description, location, openingHours } = req.body;

        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return next(new ErrorHandler(`Restaurant not found with id ${id}`, 404));
        }

        // Update restaurant properties
        // restaurant.name = name;
        // restaurant.description = description;
        // restaurant.location = location;
        // restaurant.openingHours = openingHours;

        // Save the updated restaurant
        await restaurant.save();

        const successResponse = new SuccessHandler('Restaurant updated successfully', restaurant);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = updateRestaurant;