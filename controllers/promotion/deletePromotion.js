const catchAsyncError = require('../../middlewares/catchAsyncError');
const Promotion = require('../../model/promotion');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const deletePromotion = catchAsyncError(async (req, res, next) => {
    try {
        const promotionId = req.params.id;

        // Find the promotion by ID and remove it
        const promotion = await Promotion.findByIdAndDelete(promotionId);

        if (!promotion) {
            return next(new ErrorHandler(`Promotion not found with id ${promotionId}`, 404));
        }

        const successResponse = new SuccessHandler('Promotion deleted successfully', promotion);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = deletePromotion;
