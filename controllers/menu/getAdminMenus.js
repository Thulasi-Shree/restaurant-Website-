const Menu = require('../../model/menuItem');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const SuccessHandler = require('../../utils/successHandler');
const ErrorHandler = require('../../utils/errorHandler');

const getAdminMenus = catchAsyncError(async (req, res, next) => {
    try {
        const menus = await Menu.find();

        const successHandler = new SuccessHandler('Menus fetched successfully', menus);
        successHandler.sendResponse(res, 200);
    } catch (error) {
        console.error(error);
        const errorHandler = new ErrorHandler('Internal Server Error', 500);
        next(errorHandler);
    }
});

module.exports = getAdminMenus;