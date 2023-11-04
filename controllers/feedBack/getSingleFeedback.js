const catchAsyncError = require('../../middlewares/catchAsyncError');
const FeedBack = require('../../model/feedback');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const getFeedbackById = catchAsyncError(async (req, res, next) => {
    try {
        const feedbackId = req.params.id;

        // Attempt to find feedback by ID
        const feedback = await FeedBack.findById(feedbackId);

        // If feedback is not found, return a 404 error
        if (!feedback) {
            return next(new ErrorHandler('Feedback not found', 404));
        }

        // Send success response with the retrieved feedback
        const successResponse = new SuccessHandler('Feedback retrieved successfully', feedback);
        successResponse.sendResponse(res);
    } catch (error) {
        // Handle errors using the global error handling middleware or custom error handling logic
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = getFeedbackById;
