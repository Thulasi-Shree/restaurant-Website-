const twilio = require('twilio');

const accountSid = 'AC3d4f5168d60ee1ccae7bcf5c41c19b05';
const authToken = '056d4039b101a9a1625086eb636db8ff';
const twilioPhoneNumber = '+12016958758';

const client = new twilio(accountSid, authToken);

const sendOtp = async (mobile, otp) => {
    try {
        await client.messages.create({
            body: `Your OTP: ${otp}`,
            to: mobile,
            from: twilioPhoneNumber,
        });

        console.log('OTP sent successfully via SMS');
    } catch (error) {
        console.error('Error sending OTP via SMS:', error);
        throw new Error('Failed to send OTP');
    }
};

module.exports = sendOtp;