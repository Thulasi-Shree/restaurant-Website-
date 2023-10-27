const catchAsyncError = require('../../middlewares/catchAsyncError');
const Address = require('../../model/Address');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

const createAddress = catchAsyncError(async (req, res, next) => {
    const {  street, city, state, postalCode, country } = req.body;

    const address = await Address.create({
        userId : req.user.id,
        street,
        city,
        state,
        postalCode,
        country,
    });

    const successResponse = new SuccessHandler('Address added successfully', address);
    successResponse.sendResponse(res, 201);
});
module.exports = createAddress