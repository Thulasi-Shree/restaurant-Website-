// const catchAsyncError = require('../../middlewares/catchAsyncError');
// const User = require('../../model/user');
// const sendToken = require('../../utils/jwt');
// const ErrorHandler = require('../../utils/errorHandler');

// exports.registerUser = catchAsyncError(async (req, res, next) => {
//     const { name, lastName, email, password, phone, role,
//         restaurantBranch,
//         restaurantId } = req.body;

//     let BASE_URL = process.env.PORT;
//     if (process.env.NODE_ENV === "production") {
//         BASE_URL = `${req.protocol}://${req.get('host')}`;
//     }

//     try {
//         // Check if email or phone number already exists in the database
//         const existingUserByEmail = await User.findOne({ email });
//         const existingUserByPhone = await User.findOne({ phone });

//         if (existingUserByEmail) {
//             return next(new ErrorHandler('Email address is already registered', 400));
//         }

//         if (existingUserByPhone) {
//             return next(new ErrorHandler('Phone number is already registered', 400));
//         }

//         // If email and phone are unique, create the user
//         const user = await User.create({
//             name,
//             lastName,
//             email,
//             password,
//             phone,
//             role,
//             restaurantBranch,
//             restaurantId
//         });

//         sendToken(user, 201, res);
//     } catch (error) {
//         console.error(error);
//         next(new ErrorHandler('Internal Server Error', 500));
//     }
// });
const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const sendToken = require('../../utils/jwt');
const ErrorHandler = require('../../utils/errorHandler');
const { sendVerificationEmail } = require('../../utils/email');

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {
        name,
        lastName,
        email,
        password,
        phone,
        role,
        restaurantBranch,
        restaurantId,
    } = req.body;

    let BASE_URL = process.env.PORT;
    if (process.env.NODE_ENV === 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')} `;
    }

    try {
        // Check if email or phone number already exists in the database
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByPhone = await User.findOne({ phone });

        if (existingUserByEmail) {
            return next(
                new ErrorHandler('Email address is already registered', 400)
            );
        }

        if (existingUserByPhone) {
            return next(
                new ErrorHandler('Phone number is already registered', 400)
            );
        }

        // Create a new instance of the User model
        const user = new User({
            name,
            lastName,
            email,
            password,
            phone,
            role,
            restaurantBranch,
            restaurantId,
            emailVerificationStatus: false,
        });

        // Generate a unique verification token using the instance method
        const emailVerificationToken = user.generateEmailVerificationToken();

        // Save the instance to the database
        await user.save();

        // Send verification email
        const verificationLink = `${process.env.FRONTEND_URL}/api/verify-email/${emailVerificationToken}`;
        await sendVerificationEmail(email, verificationLink);

        // Respond with the generated token
        sendToken(user, 201, res);

        // Schedule automatic deletion after 5 minutes if not verified
        setTimeout(async () => {
            const userToDelete = await User.findOne({
                _id: user._id,
                emailVerificationStatus: false,
            }).lean(false);
        
            if (userToDelete) {
                // Delete the user if not verified
                await User.deleteOne({ _id: userToDelete._id });
                console.log(`User ${userToDelete.email} deleted after 5 minutes.`);
            }
        }, 5 * 60 * 1000);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500));
    }
});

