const catchAsyncError = require('../../middlewares/catchAsyncError');
const Product = require('../../model/menuItem');
const Review = require('../../model/review');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createReview = catchAsyncError(async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.params.token; // Assuming you have user information stored in req.user after authentication
        const productId = req.params.id; // Get product ID from request parameters

        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }

        // Check if the user has already reviewed the product
        const existingReview = await Review.findOne({ productId, userId });

        if (existingReview) {
            return next(new ErrorHandler('You have already reviewed this product', 400));
        }

        // Create a new review object with the user property correctly assigned
        const newReview = new Review({
            productId,
            userId,
            rating,
            comment
        });

        // Save the new review
        await newReview.save();

        // Update the product's numOfReviews and ratings
        product.numOfReviews += 1;
        product.ratings = (product.ratings * (product.numOfReviews - 1) + rating) / product.numOfReviews;

        // Save the updated product
        await product.save();
        const successResponse = new SuccessHandler('Review created successfully', newReview);
        successResponse.sendResponse(res, 201);
        // res.status(201).json({ success: true, message: 'Review created successfully', data: newReview });
    } catch (error) {
        
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

module.exports = createReview;