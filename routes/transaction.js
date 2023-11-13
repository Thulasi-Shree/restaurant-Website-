const express = require('express');
const { processPayment, sendStripeApi } = require('../controllers/transaction/payment');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const router = express.Router();

// Process Payment: POST /api/payment/process (User role required)
router.route('/payment/process').post(isAuthenticatedUser,  processPayment); //authorizeRoles('user'),

// Get Stripe API Information: GET /api/stripeapi (User role required)
router.route('/stripeapi').get(isAuthenticatedUser, sendStripeApi); // authorizeRoles('user'), 



module.exports = router;  