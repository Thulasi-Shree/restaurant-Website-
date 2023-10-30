const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    const successResponse = new SuccessHandler('Users retrieved successfully', users);
    successResponse.sendResponse(res);
});

exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
    }
    const successResponse = new SuccessHandler('User retrieved successfully', user);
    successResponse.sendResponse(res);
});
 
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    });

    const successResponse = new SuccessHandler('User updated successfully', user);
    successResponse.sendResponse(res);
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
    }
    await User.deleteOne({ _id: req.params.id });
    const successResponse = new SuccessHandler('User deleted successfully');
    successResponse.sendResponse(res);
}); 






// const catchAsyncError = require('../../middlewares/catchAsyncError');
// const User = require('../../model/user');
// const ErrorHandler = require('../../utils/errorHandler');

// exports.getAllUsers = catchAsyncError(async (req, res, next) => {
//     const users = await User.find();
//     res.status(200).json({
//         success: true,
//         users
//     })
// })

// //Get Specific User 
// exports.getUser = catchAsyncError(async (req, res, next) => {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//         return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
//     }
//     res.status(200).json({
//         success: true,
//         user
//     })
// });

// //Update User
// exports.updateUser = catchAsyncError(async (req, res, next) => {
//     const newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//         role: req.body.role
//     }

//     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
//         new: true,
//         runValidators: true,
//     })

//     res.status(200).json({
//         success: true,
//         user
//     })
// })

// Delete User 
// exports.deleteUser = catchAsyncError(async (req, res, next) => {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//         return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
//     }
//     await user.remove();
//     res.status(200).json({
//         success: true,
//     })
// })

// exports.deleteUser = catchAsyncError(async (req, res, next) => {
//     try {
//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
//         }

//         // Ensure user is a Mongoose model instance
//         if (!user instanceof User) {
//             return next(new ErrorHandler('Invalid user object'));
//         }

//         // Call the remove method to delete the user
//         await User.deleteOne({ _id: req.params.id });

//         res.status(200).json({
//             success: true,
//         });
//     } catch (error) {
//         // Handle any potential errors, log them, and send an appropriate response
//         console.error(error);
//         return next(new ErrorHandler('Internal Server Error', 500));
//     }
// });