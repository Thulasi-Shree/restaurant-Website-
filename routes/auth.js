const express = require('express');
const router = express.Router();
const registerController = require('../controllers/auth/register');
const loginController = require('../controllers/auth/login');
const loginOtpController = require('../controllers/auth/login');
const logoutController = require('../controllers/auth/logout');
const forgotPasswordController = require('../controllers/auth/forgotPassword');
const resetPasswordController = require('../controllers/auth/resetPassword');
const profileController = require('../controllers/auth/profile');

router.post('/register', registerController.registerUser);
router.post('/login', loginController.loginUser);
router.post('/login/otp', loginOtpController.sendUserOtp);
router.post('/logout', logoutController.logoutUser);
router.post('/password/forgot', forgotPasswordController.forgotPassword);
router.put('/password/reset/:token', resetPasswordController.resetPassword);
router.get('/myprofile/:token', profileController.getUserProfile);
router.put('/password/change/:id', profileController.changePassword);
router.put('/update/:token', profileController.updateProfile);


module.exports = router;
