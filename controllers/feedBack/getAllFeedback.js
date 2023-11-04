const catchAsyncError = require('../../middlewares/catchAsyncError');
const FeedBack = require('../../model/feedback');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const getAllFeedback = catchAsyncError(async (req, res, next) => {
    try {
        // Attempt to retrieve all feedback
        const feedback = await FeedBack.find();

        // Send success response with the retrieved feedback
        const successResponse = new SuccessHandler('All feedback retrieved successfully', feedback);
        successResponse.sendResponse(res);
    } catch (error) {
        // Handle errors using the global error handling middleware or custom error handling logic
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = getAllFeedback;
