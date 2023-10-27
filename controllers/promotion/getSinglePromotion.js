const catchAsyncError = require('../../middlewares/catchAsyncError');
const Promotion = require('../../model/promotion');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const getSinglePromotion = catchAsyncError(async (req, res, next) => {
    try {
        const promotionId = req.params.id;

        const promotion = await Promotion.findById(promotionId);

        if (!promotion) {
            return next(new ErrorHandler(`Promotion not found with id ${promotionId}`, 404));
        }

        const successResponse = new SuccessHandler('Promotion retrieved successfully', promotion);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = getSinglePromotion;
