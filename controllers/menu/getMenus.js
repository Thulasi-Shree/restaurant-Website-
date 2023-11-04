const Menu = require('../../model/menuItem');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const APIFeatures = require('../../utils/apiFeatures');
const ErrorHandler = require('../../utils/errorHandler');

const getMenus = catchAsyncError(async (req, res, next) => {
    try {
        const resPerPage = 8;

        let buildQuery = () => {
            return new APIFeatures(Menu.find(), req.query).search().filter().categoryFilter();
        };

        const filteredMenusCount = await buildQuery().query.countDocuments({});
        const totalMenusCount = await Menu.countDocuments({});
        let menusCount = totalMenusCount;

        if (filteredMenusCount !== totalMenusCount) {
            menusCount = filteredMenusCount;
        }

        const Menus = await buildQuery().paginate(resPerPage).query;

        if (!Menus || Menus.length === 0) {

            const errorHandler = new ErrorHandler('No menus found', 400);
            next(errorHandler);
        }

        res.status(200).json({
            success: true,
            count: totalMenusCount,
            resPerPage,
            Menus
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
      
    }
});

module.exports = getMenus;
