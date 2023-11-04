const catchAsyncError = require('../../middlewares/catchAsyncError');
const FeedBack = require('../../model/feedback');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createFeedback = catchAsyncError(async (req, res, next) => {
    try {
        const { type, message } = req.body;
        const user = req.user.id; // Assuming you have user data in req.user

        // Create a new feedback instance
        const feedback = await FeedBack.create({ user, type, message });

        // Send success response with status code 201
        const successResponse = new SuccessHandler('Feedback sent successfully', feedback);
        successResponse.sendResponse(res, 201);
    } catch (error) {
        // Handle errors using the global error handling middleware or custom error handling logic
        next(new ErrorHandler(error.message , 500)); 
    }
});

module.exports = createFeedback;
