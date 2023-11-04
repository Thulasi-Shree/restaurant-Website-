const Review = require('../../model/review');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const ErrorHandler = require('../../utils/errorHandler');

const getReviews = catchAsyncError(async (req, res, next) => {
    try {
        const productId = req.params.productId;

        const reviews = await Review.find({ productId: productId });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ success: false, message: 'No reviews found for the specified product' });
        }

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = getReviews;