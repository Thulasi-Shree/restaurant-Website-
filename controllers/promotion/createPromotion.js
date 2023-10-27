const catchAsyncError = require('../../middlewares/catchAsyncError');
const Promotion = require('../../model/promotion');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createPromotion = catchAsyncError(async (req, res, next) => {
    try {
        const { code, description, discountAmount, minimumOrderAmount, expirationDate } = req.body;

        // Create a new promotion
        const promotion = await Promotion.create({
            code,
            description,
            discountAmount,
            minimumOrderAmount,
            expirationDate,
        });

        const successResponse = new SuccessHandler('Promotion created successfully', promotion);
        successResponse.sendResponse(res, 201);
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return next(new ErrorHandler(error.message, 400));
        }
        // Handle other errors
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = createPromotion;
