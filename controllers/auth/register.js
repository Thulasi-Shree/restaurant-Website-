const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const sendToken = require('../../utils/jwt');
const ErrorHandler = require('../../utils/errorHandler');

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, lastName, email, password, phone } = req.body;

    let BASE_URL = process.env.PORT;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    try {
        // Check if email or phone number already exists in the database
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByPhone = await User.findOne({ phone });

        if (existingUserByEmail) {
            return next(new ErrorHandler('Email address is already registered', 400));
        }

        if (existingUserByPhone) {
            return next(new ErrorHandler('Phone number is already registered', 400));
        }

        // If email and phone are unique, create the user
        const user = await User.create({
            name,
            lastName,
            email,
            password,
            phone,
        });

        sendToken(user, 201, res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler('Internal Server Error', 500)); 
    }
});
