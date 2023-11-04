const catchAsyncError = require('../../middlewares/catchAsyncError');
const Product = require('../../model/menuItem');
const Review = require('../../model/review');
const ErrorHandler = require('../../utils/errorHandler');

const deleteReview = catchAsyncError(async (req, res) => {
    try {
        const userId = req.params.token; 
        const reviewId = req.params.reviewId; 

        
        if (reviewId) {
            // Admin role: Delete review by review ID
            const deletedReview = await Review.findByIdAndDelete(reviewId);

            if (!deletedReview) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }

            // Automatically decrease the number of reviews in the menu item
            const product = await Product.findById(deletedReview.productId);
            if (product) {
                product.numOfReviews -= 1;
                if (product.numOfReviews > 0 && product.reviews && product.reviews.length > 0) {
                    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
                    product.ratings = totalRating / product.numOfReviews;
                } else {
                    product.ratings = 0;
                }
                await product.save();
            }

            return res.status(200).json({ success: true, message: 'Review deleted successfully', data: deletedReview });
        } else {
            // User role: Delete user's own review associated with a product
            const productId = req.params.id; // Product ID from the request parameters

            // Find the product by ID
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            // Find the user's review in the product's reviews array
            const userReviewIndex = product.reviews.findIndex(review => review.user && review.user.toString() === userId);

            if (userReviewIndex === -1) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }

            // Remove the review from the product's reviews array
            product.reviews.splice(userReviewIndex, 1);
            product.numOfReviews = product.reviews.length;

            // Recalculate the average rating for the product
            if (product.numOfReviews > 0 && product.reviews && product.reviews.length > 0) {
                const totalRating = product.reviews.reduce((acc, review) => acc + parseInt(review.rating), 0);
                product.ratings = totalRating / product.numOfReviews;
            } else {
                product.ratings = 0;
            }

            // Save the updated product
            await product.save();

            // Delete the review from the Review collection
            await Review.findOneAndDelete({ productId: productId, userId: userId });

            return res.status(200).json({ success: true, message: 'Review deleted successfully', data: product });
        }
    } catch (error) {
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = deleteReview;


