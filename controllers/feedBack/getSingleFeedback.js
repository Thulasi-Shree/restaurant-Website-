const catchAsyncError = require('../../middlewares/catchAsyncError');
const FeedBack = require('../../model/feedback');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const getFeedbackById = catchAsyncError(async (req, res, next) => {
    const feedbackId = req.params.id;

    const feedback = await FeedBack.findById(feedbackId);

    if (!feedback) {
        return next(new ErrorHandler('Feedback not found', 404));
    }

    const successResponse = new SuccessHandler('Feedback retrieved successfully', feedback);
    successResponse.sendResponse(res);
});

module.exports = getFeedbackById;
