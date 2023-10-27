const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');
const sendToken = require('../../utils/jwt');
const sendLoginEmail = require('../../utils/email'); 
const ErrorHandler = require('../../utils/errorHandler');

exports.loginUser = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password, otp } = req.body;

        if (!email) {
            throw new ErrorHandler('Please enter email', 400);
        }

        let user;

        if (otp) {
            user = await User.findOne({ email, loginOtp: otp });


            if (!user || !user.$isValid(otp)) {
                throw new ErrorHandler('Invalid OTP', 401);
            }
        } else if (password) {
            // Check if password is provided 
            user = await User.findOne({ email }).select('+password');

            if (!user || !(await user.isValidPassword(password))) {
                throw new ErrorHandler('Invalid email or password', 401);
            }
        } else {
            // If neither password nor OTP is provided
            throw new ErrorHandler('Please provide password or OTP', 400);
        }
 user.loginOtp = req.body.otp;
        user.loginOtp = undefined;
        user.loginOtpExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
});



exports.sendUserOtp = catchAsyncError(async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new ErrorHandler('Please enter email', 400);
        }

        const otp = await sendLoginEmail({
            email: email,
            subject: 'Login OTP',
            message: 'Your OTP for login is: '
        });

        // Save the OTP in the user's document for verification (You might need to adjust your User model)
        const user = await User.findOneAndUpdate({ email }, { loginOtp: otp }, { new: true });

        if (!user) {
            throw new ErrorHandler('Invalid email', 401);
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email for login verification'
        });
    } catch (error) {
        next(error);
    }
});
