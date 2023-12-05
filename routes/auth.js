const express = require('express');
const router = express.Router();
const registerController = require('../controllers/auth/register');
const loginController = require('../controllers/auth/login');
const loginOtpController = require('../controllers/auth/login');
const logoutController = require('../controllers/auth/logout');
const forgotPasswordController = require('../controllers/auth/forgotPassword');
const resetPasswordController = require('../controllers/auth/resetPassword');
const profileController = require('../controllers/auth/profile');
const { isAuthenticatedUser } = require('../middlewares/authenticate');

// User Registration: POST /api/register
router.post('/register', registerController.registerUser);

// User Login with Credentials: POST /api/login
router.post('/login', loginController.loginUser);

// Send OTP in Mail for Login: POST /api/login/otp
router.post('/login/otp', loginOtpController.sendUserOtp); 

// User Logout: POST /api/logout
router.post('/logout', logoutController.logoutUser);

// Forgot Password: POST /api/password/forgot
router.post('/password/forgot', forgotPasswordController.forgotPassword);

// Reset Password with Token: PUT /api/password/reset/:token
router.put('/password/reset/:token', resetPasswordController.resetPassword);

// Get User Profile: GET /api/myprofile/:token   
router.get('/myprofile/:token', profileController.getUserProfile);
router.route('/myprofile').get(isAuthenticatedUser, loginController.getUserProfile);

// Change Password: PUT /api/password/change/:id
router.put('/password/change/:id', profileController.changePassword);

// Update User Profile: PUT /api/update/:token
router.put('/update/:token', profileController.updateProfile);



module.exports = router;
