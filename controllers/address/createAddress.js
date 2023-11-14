const catchAsyncError = require('../../middlewares/catchAsyncError');
const Address = require('../../model/Address');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');
const axios = require('axios');

const createAddress = catchAsyncError(async (req, res, next) => {
    const { street, city, state, postalCode, country } = req.body;
    try {
        // Use a geocoding service to obtain latitude and longitude based on the provided address
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${street},${city},${state},${postalCode},${country}&key=GOOGLE_MAPS_API_KEY`);

        const { results } = response.data;
        if (results.length === 0) {
            return next(new ErrorHandler('Invalid address', 400));
        }

        const { lat, lng } = results[0].geometry.location;

        const address = await Address.create({
            userId: req.user.id,
            street,
            city,
            state,
            postalCode,
            country,
            latitude: lat,
            longitude: lng
        });

        const successResponse = new SuccessHandler('Address added successfully', address);
        successResponse.sendResponse(res, 200);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = createAddress;

// // Instead of directly calling axios.get, inject a function that makes the API call
// const createAddress = catchAsyncError(async (req, res, next, geocodeFn) => {
//     // ... (existing code)

//     try {
//         // Make the geocoding API call
//         const response = await geocodeFn(`https://maps.googleapis.com/maps/api/geocode/json?address=${street},${city},${state},${postalCode},${country}&key=GOOGLE_MAPS_API_KEY`);

//         // ... (rest of the code)
//     } catch (error) {
//         console.error(error);
//         next(new ErrorHandler('Internal Server Error', 500));
//     }
// });

// // In your route/controller where you use the middleware
// const geocodeFn = async (url) => axios.get(url);
// createAddress(req, res, next, geocodeFn);
