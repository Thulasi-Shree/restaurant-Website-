const catchAsyncError = require('../../middlewares/catchAsyncError');
const User = require('../../model/user');

exports.confirmRegistration = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;

    try {
        // Find the user with the provided token
        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) {
            // Token is invalid or expired
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }

        // Check if the token is still valid (you can set an expiration time for the token)
        // For example, you can check if the token is created within the last 24 hours
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const isTokenExpired = Date.now() - user.emailVerificationSentAt.getTime() > expirationTime;

        if (isTokenExpired) {
            // Token is expired
            return res.status(400).json({ success: false, message: 'Token has expired' });
        }

        // Update the user's emailVerificationStatus to true
        user.emailVerificationStatus = true;
        await user.save();

        // Respond with a success message
        return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
