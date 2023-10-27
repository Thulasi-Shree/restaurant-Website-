const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const autopopulate = require('mongoose-autopopulate');

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Please enter name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address'],
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, 'any', { strictMode: false });
            },
            message: 'Please enter a valid phone number',
        },
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'deliveryPerson', 'restaurantOwner'],
        default: 'user',
    },
    orderHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    appliedPromotions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
    }],
    address: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Address'
    },
    loginOtp: String,
    loginOtpExpire: Date,
    resetPasswordToken: String,

    resetPasswordTokenExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now,
    },
});


userSchema.plugin(autopopulate);


userSchema.pre('save', async function (next) {
    if (this.isModified('loginOtp')) {
        const otpExpirationTime = Date.now() + 30 * 60 * 10000; // OTP valid for 30 minutes
        this.loginOtpExpire = otpExpirationTime;
        const plainOtp = crypto.randomBytes(20).toString('hex'); // Generate plain OTP
        this.loginOtp = this.generateHashedOtp(plainOtp); // Hash the plain OTP
    }
    next();
});

userSchema.methods.generateHashedOtp = function (otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
};


userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.getJwtToken = function () {
    try {
        return jwt.sign({ id: this.id }, process.env.JSON_WEB_TOKEN_SECRECT, {
            expiresIn: process.env.JSON_WEB_TOKEN_EXPIRE_DATE
        });
    } catch (error) {
        throw new Error('Token generation failed');
    }
};

userSchema.methods.isValidPassword = async function (reqPassword) {
    try {
        return await bcrypt.compare(reqPassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

userSchema.methods.getUserPassword = function () {
    try {
        const token = crypto.randomBytes(20).toString('hex');
        this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 10000;
        return token;
    } catch (error) {
        throw new Error('Token generation for password reset failed');
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;