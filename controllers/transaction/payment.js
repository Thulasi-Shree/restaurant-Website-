const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { logError } = require('../../utils/logError');
const catchAsyncError = require("../../middlewares/catchAsyncError");

exports.processPayment = catchAsyncError(async (req, res) => {
    console.log(`Received request at: ${req.originalUrl}`);
    try {
        const { amount, shipping } = req.body;
        console.log(`Received request at: ${req.originalUrl}`);
        if (!amount || !shipping) {
            return res.status(400).json({ success: false, error: "Invalid input data" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            description: "PAYMENT",
            metadata: { integration_check: "accept_payment" },
            shipping
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        });
    } catch (error) {
        logError(error); 
        console.log(`Received request at: ${req.originalUrl}`);
        res.status(500).json({ success: false, error: "An error occurred while processing the payment." });
    }
});

exports.sendStripeApi = catchAsyncError((req, res) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_PUBLIC_KEY 
    });
});
