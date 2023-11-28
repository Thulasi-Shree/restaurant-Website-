const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    try {
        const users = await User.find();
        const successResponse = new SuccessHandler('Users retrieved successfully', users);
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message)); // Passes the error to the global error handling middleware
    }
});

exports.getUser = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
        }
        const successResponse = new SuccessHandler('User retrieved successfully', user);
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message)); // Passes the error to the global error handling middleware
    }
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            restaurantBranch: req.body.assignBranch,
            restaurantId: req.body.assignBranchId
        };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
        });

        const successResponse = new SuccessHandler('User updated successfully', user);
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message)); // Passes the error to the global error handling middleware
    }
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
        }
        await User.deleteOne({ _id: req.params.id });
        const successResponse = new SuccessHandler('User deleted successfully');
        successResponse.sendResponse(res);
    } catch (error) {
        next(new ErrorHandler(error.message)); // Passes the error to the global error handling middleware
    }
});


