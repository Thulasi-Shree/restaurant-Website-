const catchAsyncError = require('../../middlewares/catchAsyncError');
const Promotion = require('../../model/promotion');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const getAllPromotions = catchAsyncError(async (req, res, next) => {
    try {
        const promotions = await Promotion.find();

        const successResponse = new SuccessHandler('Promotions retrieved successfully', promotions);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = getAllPromotions;
