const mongoose = require('mongoose');
const crypto = require('crypto');

const guestUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otpHash: {
    type: String,
  },
});

guestUserSchema.methods.generateHashedOTP = function (otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

guestUserSchema.methods.generateOTP = function (length) {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// You can add more fields and methods as needed

const GuestUser = mongoose.model('GuestUser', guestUserSchema);

module.exports = GuestUser;
