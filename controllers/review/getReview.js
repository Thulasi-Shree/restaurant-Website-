const Review = require('../../model/review');
const catchAsyncError = require('../../middlewares/catchAsyncError');

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
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = getReviews;

// const Review = require('../../model/review');
// const catchAsyncError = require('../../middlewares/catchAsyncError');

// const getReviews = catchAsyncError(async (req, res, next) => {
//     const review = await Review.findById(req.params.productId).populate('reviews.user','name email');

//     res.status(200).json({
//         success: true,
//         reviews: review
//     })    

// });

// module.exports = getReviews;