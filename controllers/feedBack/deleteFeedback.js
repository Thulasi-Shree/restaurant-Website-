const catchAsyncError = require('../../middlewares/catchAsyncError');
const FeedBack = require('../../model/feedback');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const deleteFeedback = catchAsyncError(async (req, res, next) => {
    try {
        const feedbackId = req.params.id;

        // Attempt to find and delete the feedback
        const feedback = await FeedBack.findByIdAndDelete(feedbackId);

        // If the feedback is not found, handle the error
        if (!feedback) {
            return next(new ErrorHandler('Feedback not found', 404));
        }

        // Send success response with status code 200
        const successResponse = new SuccessHandler('Feedback deleted successfully', {});
        successResponse.sendResponse(res, 200);
    } catch (error) {
        // Handle errors using the global error handling middleware or custom error handling logic
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = deleteFeedback;
