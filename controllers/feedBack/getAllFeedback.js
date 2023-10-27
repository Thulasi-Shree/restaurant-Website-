const catchAsyncError = require('../../middlewares/catchAsyncError');
const FeedBack = require('../../model/feedback');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const getAllFeedback = catchAsyncError(async (req, res, next) => {
    const feedback = await FeedBack.find();

    const successResponse = new SuccessHandler('All feedback retrieved successfully', feedback);
    successResponse.sendResponse(res);
});

module.exports = getAllFeedback;
