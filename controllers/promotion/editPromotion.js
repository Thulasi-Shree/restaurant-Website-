const catchAsyncError = require('../../middlewares/catchAsyncError');
const Promotion = require('../../model/promotion');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const editPromotion = catchAsyncError(async (req, res, next) => {
    try {
        const promotionId = req.params.id;
        const { code, description, discountAmount, minimumOrderAmount, expirationDate, isActive } = req.body;

        // Find the promotion by ID and update its properties
        const promotion = await Promotion.findByIdAndUpdate(promotionId, {
            code,
            description,
            discountAmount,
            minimumOrderAmount,
            expirationDate,
            isActive
        }, { new: true, runValidators: true });

        if (!promotion) {
            return next(new ErrorHandler(`Promotion not found with id ${promotionId}`, 404));
        }

        const successResponse = new SuccessHandler('Promotion updated successfully', promotion);
        successResponse.sendResponse(res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = editPromotion;
