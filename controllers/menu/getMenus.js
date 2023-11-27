const Menu = require('../../model/menuItem');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const APIFeatures = require('../../utils/apiFeatures');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

exports.getMenus = catchAsyncError(async (req, res, next) => {
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


// const Menu = require('../../model/menuItem');
// const catchAsyncError = require('../../middlewares/catchAsyncError');
// const APIFeatures = require('../../utils/apiFeatures');
// const ErrorHandler = require('../../utils/errorHandler');

// const getMenus = catchAsyncError(async (req, res, next) => {
//     try {
//         const resPerPage = 8;

//         let buildQuery = () => {
//             // Assuming the restaurant name is passed in the request query as 'restaurantName'
//             const restaurantName = req.query.restaurantName;
            
//             // Building the query with the restaurant name
//             const query = Menu.find({ restaurant: restaurantName });
            
//             return new APIFeatures(query, req.query).search().filter().categoryFilter();
//         };

//         const filteredMenusCount = await buildQuery().query.countDocuments({});
//         const totalMenusCount = await Menu.countDocuments({});
//         let menusCount = totalMenusCount;

//         if (filteredMenusCount !== totalMenusCount) {
//             menusCount = filteredMenusCount;
//         }

//         const Menus = await buildQuery().paginate(resPerPage).query;

//         if (!Menus || Menus.length === 0) {
//             const errorHandler = new ErrorHandler('No menus found', 400);
//             next(errorHandler);
//         }

//         res.status(200).json({
//             success: true,
//             count: totalMenusCount,
//             resPerPage,
//             Menus
//         });
//     } catch (error) {
//         next(new ErrorHandler(error.message, 500));
//     }
// });

// module.exports = getMenus;


exports.getAdminMenusByBranch = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.body.restaurantId;
        const menus = await Menu.find({  
            restaurantId: restaurantId
        });

        const successHandler = new SuccessHandler('Menus fetched successfully', menus);
        successHandler.sendResponse(res, 200);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});
