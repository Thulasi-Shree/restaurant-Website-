const ErrorHandler = require('../../utils/errorHandler');

exports.logoutUser = (req, res, next) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        .status(200)
        .json({
            success: true,
            message: "Logged out"
        });
    } catch (error) {
        next(new ErrorHandler('Internal Server Error', 500));
    }
};
