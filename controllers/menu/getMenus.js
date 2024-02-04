const Menu = require('../../model/menuItem');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const APIFeatures = require('../../utils/apiFeatures');
const ErrorHandler = require('../../utils/errorHandler');
const SuccessHandler = require('../../utils/successHandler');

// exports.getMenus = catchAsyncError(async (req, res, next) => {
//     try {
//         const resPerPage = 3;

//         let buildQuery = () => {
//             return new APIFeatures(Menu.find(), req.query).search().filter().categoryFilter();
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


exports.getMenus = catchAsyncError(async (req, res, next) => {
    const resPerPage = 30;
  
    try {
      const filteredMenusCount = await new APIFeatures(Menu.find(), req.query)
        .search()
        .filter()
        .sort()
        .paginate(resPerPage)
        .query.countDocuments({});
      
      const totalMenusCount = await Menu.countDocuments({});
      const menusCount = (filteredMenusCount !== totalMenusCount) ? filteredMenusCount : totalMenusCount;
  
      const Menus = await new APIFeatures(Menu.find(), req.query)
        .search()
        .filter()
        .sort()
        .paginate(resPerPage)
        .query;
  
      if (!Menus || Menus.length === 0) {
        // const errorHandler = new ErrorHandler('No menus found', 400);
        // return next(errorHandler);
        res.status(200).json({
          success: true,
          count: menusCount,
          resPerPage,
          Menus,
          message: 'no menus found'
        });
      }
  
      res.status(200).json({
        success: true,
        count: menusCount,
        resPerPage,
        Menus
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
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
  const { page = 1, pageSize = 10 } = req.query;
    try {
      const totalItems = await Menu.countDocuments();
        const restaurantId = req.body.restaurantId;
        
        const skip = (page - 1) * pageSize;
        const menus = await Menu.find({  
          restaurantId: restaurantId
      }).skip(skip).limit(parseInt(pageSize));

        res.set('X-Total-Count', totalItems.toString());
       
        const successHandler = new SuccessHandler('Menus fetched successfully', menus);
        successHandler.sendResponse(res, 200);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler(error.message, 500));
    }
});
