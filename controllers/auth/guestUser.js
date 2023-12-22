const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/GuestUser');
const sendToken = require('../../utils/jwt');
const ErrorHandler = require('../../utils/errorHandler');
const { sendEmail } = require('../../utils/email');
const crypto = require('crypto');



const generateHashedOTP = (otp) => {
  if (!otp) {
    throw new ErrorHandler('Invalid OTP value.', 400);
  }

  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  return hashedOTP;
};

exports.verifyGuestUserOtp = catchAsyncError(async (req, res) => {
  try {
    const { email, enteredOtp } = req.body;

    // Retrieve the user from the database
    let user = await User.findOne({ email });

    // Check if the user exists and has an OTP stored
    if (!user || !user.otpHash) {
      throw new ErrorHandler('Invalid email or OTP not generated.', 400);
    }

    // Check if entered OTP is provided
    if (!enteredOtp) {
      throw new ErrorHandler('Please provide the OTP for verification.', 400);
    }

    // Check if entered OTP is correct
    const enteredHashedOTP = generateHashedOTP(enteredOtp);

    if (enteredHashedOTP === user.otpHash) {
      // OTP is valid, you can perform the necessary actions here
      user.loginOtp = undefined;
      user.loginOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(200).json({ success: true, message: 'OTP verified successfully.' });
    } else {
      throw new ErrorHandler('Invalid OTP.', 401);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP.' });
  }
});
  
exports.sendGuestUserOtp = catchAsyncError( async (req, res) => {
    try {
      const { email } = req.body;
  
      // Generate a random OTP (you might want to use a library for a more secure implementation)
    //   const otp = Math.floor(100000 + Math.random() * 900000);
      const generateOTP = (length) => {
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < length; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    };
    
    const generateHashedOTP = (otp) => {
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
        return hashedOTP;
    };
    
    const plainOTP = generateOTP(6); 
    const hashedOTP = generateHashedOTP(plainOTP);
    let user = await User.findOne({ email });

    if (!user) {
      // If the user does not exist, create a new user
      user = new User({ email, otpHash: hashedOTP });
    } else {
      // If the user exists, update the existing user
      user.otpHash = hashedOTP;
    }
  
      const message = `Your OTP for login is: ${plainOTP}`;

    await sendEmail({
        email,
        subject: 'Login OTP',
        message
    });
    await user.save();
      res.status(200).json({ success: true, message: 'OTP sent successfully.' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
  });