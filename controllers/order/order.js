const catchAsyncError = require('../../middlewares/catchAsyncError');
const { startOfWeek, startOfMonth, subMonths, subYears } = require('date-fns');
const Order = require('../../model/order');
const Cart = require('../../model/cart');

const ErrorHandler = require('../../utils/errorHandler');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../../utils/email');

exports.newOrder = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.body.restaurantId ? req.body.restaurantId.toString() : null;
        // const userId = req.body.userId ? req.body.userId.toString() : null;
        const restaurantBranch = req.body.restaurantBranch ? req.body.restaurantBranch.toString() : null;
        const {
            shipping,
            email,
            userId,
            delivery,
            phone,
            items,
            emailOrMobile,
            orderInstruction,
            deliveryInstruction,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentStatus,
            selectedTimeSlot,
            paymentInfo,
            orderType,
            orderDate
        } = req.body;

        const order = await Order.create({
            items,
            email,
            phone,
            shipping,
            delivery,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paymentStatus,
            orderInstruction,
            deliveryInstruction,
            selectedTimeSlot,
            orderType,
            emailOrMobile,
            restaurantId, 
            restaurantBranch, 
            orderDate,   
            paidAt: Date.now(),
            userId
        });
        // await order.populate('user', 'name email phone');

        sendOrderConfirmationEmail(order.shipping.email, order);
        if (!order.shipping.email) {
            sendOrderConfirmationEmail(order.shipping.emailOrMobile, order);
          }
        // await Cart.findOneAndUpdate({ user: req.body }, { items: [] });

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});
   
exports.updateOrderStatus = catchAsyncError( async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
        // await order.populate('user', 'name email phone');
        sendOrderStatusUpdateEmail(order.shipping.email, order);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

// exports.myOrders = catchAsyncError(async (req, res, next) => {
//     try {
//         const orders = await Order.find({ user: req.body.user });
//         res.status(200).json({
//             success: true,
//             orders
//         });
//     } catch (error) {
//         next(new ErrorHandler(error.message || 'Internal Server Error', 500));
//     }
// });
exports.myOrders = catchAsyncError(async (req, res, next) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            throw new ErrorHandler('Invalid user ID provided in the request', 400);
        }

        const order = await Order.find({ userId });

        if (!order) {
            throw new ErrorHandler(`Order not found`, 404);
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        // Pass the error to the next middleware
        next(error);
    }
});

// exports.orders = catchAsyncError(async (req, res, next) => {
//     try {
//         const orders = await Order.find( {orderStatus: { $in: 'Delivered' }} );
//         let totalAmount = 0;

//         orders.forEach(order => {
//             totalAmount += order.totalPrice;
//         });

//         res.status(200).json({
//             success: true,
//             totalAmount,
//             orders
//         });
//     } catch (error) {
//         next(new ErrorHandler(error.message || 'Internal Server Error', 500));
//     }
// });

// exports.orders = catchAsyncError(async (req, res, next) => {
//     try {
//         let query = {
//             orderStatus: 'Delivered',
//         };

//         const { timeRange } = req.query;

//         const today = new Date();
//         const thisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
//         const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//         const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
//         const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
//         const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
//         const threeYearsAgo = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());

//         switch (timeRange) {
//             case 'today':
//                 query.createdAt = { $gte: today };
//                 break;
//             case 'thisWeek':
//                 query.createdAt = { $gte: thisWeek };
//                 break;
//             case 'thisMonth':
//                 query.createdAt = { $gte: thisMonth };
//                 break;
//             case 'lastSixMonths':
//                 query.createdAt = { $gte: sixMonthsAgo };
//                 break;
//             case 'lastYear':
//                 query.createdAt = { $gte: oneYearAgo };
//                 break;
//             case 'lastTwoYears':
//                 query.createdAt = { $gte: twoYearsAgo };
//                 break;
//             case 'lastThreeYears':
//                     query.createdAt = { $gte: threeYearsAgo };
//                     break;
//             default:
//                 // Handle invalid or no time range
//                 break;
//         }
//         if (req.query.orderType) {
//             query.orderType = req.query.orderType;
//         }
             
//         const nonActiveOrders = await Order.find(query) // Select only necessary fields
//             .sort({ createdAt: -1 }) // Sort by creation date, newest first
//             .lean(); // Convert to plain JavaScript objects

//         res.status(200).json(nonActiveOrders);
//     } catch (error) {
//         next(new ErrorHandler(error.message, 500));
//     }
   
// });

// exports.orders = catchAsyncError(async (req, res, next) => {
//     try {
//       const { startDate, endDate, orderType } = req.query;
//       const startDateTime = new Date(startDate);
//       const endDateTime = new Date(endDate);
      
//       const query = {
//         createdAt: {
//           $gte: startDateTime,
//           $lte: endDateTime,
//         },
//         orderStatus: 'Delivered',
//       };
  
//       if (orderType) {
//         query.orderType = orderType;
//       }
  
//       const nonActiveOrders = await Order.find(query)
//         .sort({ createdAt: -1 })
//         .lean()
//         .exec();
//         const totalOrders = await Order.aggregate([
//             {
//                 $match: query,
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalOrders: { $sum: 1 },
//                     totalPrice: { $sum: "$totalPrice" }
//                 },
//             },
//         ]).exec();
//         const totalOrdersCount = totalOrders.length > 0 ? totalOrders[0].totalOrders : 0;
//         const totalPrice = totalOrders.length > 0 ? Number(totalOrders[0].totalPrice.toFixed(2)) : 0;
  
//         res.status(200).json({ nonActiveOrders, totalOrders: totalOrdersCount, totalPrice });
//     } catch (error) {
//       next(new ErrorHandler(error.message, 500));
//     }
//   });
  
exports.orders = catchAsyncError(async (req, res, next) => {
    const { page = 1, pageSize = 30 } = req.query;
    try {
      const totalItems = await Order.countDocuments();
      const { startDate, endDate, orderType } = req.query;
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
  
      const query = {
        createdAt: {
          $gte: startDateTime,
          $lte: endDateTime,
        },
        orderStatus: 'Delivered',
      };
  
      if (orderType) {
        query.orderType = orderType;
      }
  
      const skip = (page - 1) * pageSize;
  
      const nonActiveOrders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(pageSize))
        .lean()
        .exec();
  
      res.set('X-Total-Count', totalItems.toString());
  
      const totalOrders = await Order.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalPrice: { $sum: "$totalPrice" },
          },
        },
      ]).exec();
  
      const totalOrdersCount = totalOrders.length > 0 ? totalOrders[0].totalOrders : 0;
      const totalPrice = totalOrders.length > 0 ? Number(totalOrders[0].totalPrice.toFixed(2)) : 0;
  
      res.status(200).json({ nonActiveOrders, totalOrders: totalOrdersCount, totalPrice });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  });
  

exports.ordersActive = catchAsyncError(async (req, res, next) => {
    const { page = 1, pageSize = 20 } = req.query;
    try {
        const totalItems = await Order.countDocuments();
        const restaurantId = req.query.restaurantId;
        const selectedDate = req.query.selectedDate;

        const skip = (page - 1) * pageSize;
        const orders = await Order.find({orderStatus: { $nin: 'Delivered' },
        orderDate: selectedDate,}).skip(skip).limit(parseInt(pageSize));

        res.set('X-Total-Count', totalItems.toString());

        let totalAmount = 0;
        const activeOrders = await Order.find({
            restaurantId,
            orderDate: selectedDate,
            orderStatus: { $nin: 'Delivered' }
        });
        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });
        const adminEmail = 'thulasi9941@gmail.com';

        // Function to calculate time difference and send reminder
        const calculateTimeDifferenceAndSendReminder = async (email, order) => {
            // Combine orderDate, selectedTimeSlot, and current year to create a valid Date object
            const currentYear = new Date().getFullYear();
            const combinedDateTimeString = `${order.orderDate}/${currentYear} ${order.selectedTimeSlot}`;
            const orderDateTime = new Date(combinedDateTimeString);
            console.log(orderDateTime)

            // Calculate the time difference in minutes
            const timeDifferenceInMinutes = (orderDateTime - new Date()) / (1000 * 60);
            console.log(timeDifferenceInMinutes)

            // Check if the order is within 60 minutes and hasn't been reminded yet
            if (timeDifferenceInMinutes <= 60 && timeDifferenceInMinutes > 0 && !order.reminderSent) {
                // Send order reminder email
                // await sendOrderReminderEmail(email, order);

                // Update the order in the database to mark the reminder as sent
                await Order.findByIdAndUpdate(order._id, { reminderSent: true });
            }
        };

        // Iterate through active orders and send reminders
        for (const order of activeOrders) {
            await calculateTimeDifferenceAndSendReminder(adminEmail, order);
        }
        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});
exports.ordersActivePickup = catchAsyncError(async (req, res, next) => {
    try {
        const orders = await Order.find( {orderStatus: { $nin: 'Delivered' }, orderType: { $in: 'Delivery' } } );
        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        next(new ErrorHandler(error.message || 'Internal Server Error', 500));
    }
});

exports.storeChosenPickupTime = async (req, res) => {
    try {
        const { orderId, chosenPickupTime } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { pickupTime: chosenPickupTime }, { new: true }).populate('pickupTime', 'slot');;

        res.status(200).json({ success: true, message: 'Chosen pickup time stored successfully', order });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// exports.ordersActive = catchAsyncError(async (req, res, next) => {
//     try {
//       // Retrieve the orderType from the query parameters
//       const orderType = req.query.orderType || 'all';
  
//       let orderQuery = { orderStatus: { $nin: 'Delivered' } };
  
//       // Add additional filtering based on orderType
//       if (orderType !== 'all') {
//         orderQuery.orderType = orderType;
//       }
  
//       const orders = await Order.find(orderQuery);
//       let totalAmount = 0;
  
//       orders.forEach((order) => {
//         totalAmount += order.totalPrice;
//       });
  
//       res.status(200).json({
//         success: true,
//         totalAmount,
//         orders,
//       });
//     } catch (error) {
//       next(new ErrorHandler(error.message || 'Internal Server Error', 500));
//     }
//   });

// try {
//     const { timeRange } = req.query;
//     const today = new Date();

//     let query = {
//       orderStatus: 'Delivered',
//     };

//     switch (timeRange) {
//       case 'today':
//         query.createdAt = { $gte: today };
//         break;
//       case 'thisWeek':
//         query.createdAt = { $gte: startOfWeek(today) };
//         break;
//       case 'thisMonth':
//         query.createdAt = { $gte: startOfMonth(today) };
//         break;
//       case 'lastSixMonths':
//         query.createdAt = { $gte: subMonths(today, 6) };
//         break;
//       case 'lastYear':
//         query.createdAt = { $gte: subYears(today, 1) };
//         break;
//       case 'lastTwoYears':
//         query.createdAt = { $gte: subYears(today, 2) };
//         break;
//       // Add more cases for other time ranges
//       default:
//         // Handle invalid or no time range
//         break;
//     }

//     if (req.query.orderType) {
//       query.orderType = req.query.orderType;
//     }

//     const nonActiveOrders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json(nonActiveOrders);
//   } catch (error) {
//     next(error);
//   }