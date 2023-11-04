const Review = require('../../model/review');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const ErrorHandler = require('../../utils/errorHandler');

const editReview = catchAsyncError(async (req, res, next) => {
    try {
        const userId = req.params.userId; // Assuming you have user information stored in req.user after authentication
        const reviewId = req.params.reviewId; // Review ID from the request parameters

        // Find the review by ID
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check if the user attempting to edit the review is the owner of the review
        if (review.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized. You do not have permission to edit this review.' });
        }

        // Update review fields only if new data is provided
        if (req.body.rating) {
            review.rating = req.body.rating;
        }

        // Update comment only if a new comment is provided
        if (req.body.comment !== undefined && req.body.comment !== '') {
            review.comment = req.body.comment;
        }

        // Save the updated review
        await review.save();

        return res.status(200).json({ success: true, message: 'Review updated successfully', data: review });
    } catch (error) {
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = editReview;
