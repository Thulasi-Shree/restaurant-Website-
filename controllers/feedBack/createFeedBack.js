const catchAsyncError = require('../../middlewares/catchAsyncError');
const FeedBack = require('../../model/feedback');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createFeedback = catchAsyncError(async (req, res, next) => {
    const { type, message } = req.body;
    const user = req.user.id; // Assuming you have user data in req.user

    const feedback = await FeedBack.create({ user, type, message });

    const successResponse = new SuccessHandler('Feedback sent successfully', feedback);
    successResponse.sendResponse(res, 201);
});

module.exports = createFeedback;
