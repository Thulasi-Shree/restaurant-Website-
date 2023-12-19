const catchAsyncError = require('../../middlewares/catchAsyncError');
const Order = require('../../model/order');
const ErrorHandler = require('../../utils/errorHandler');
const {sendOrderReminderEmail} = require('../../utils/email');

const getActiveOrdersByBranch = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.query.restaurantId;
        const selectedDate = req.query.selectedDate;

        // Handle the case where restaurantId or selectedDate is not provided
        if (!restaurantId || !selectedDate) {
            return res.status(400).json({ error: 'restaurantId and selectedDate are required' });
        }

        const activeOrders = await Order.find({
            restaurantId,
            orderDate: selectedDate,
            orderStatus: { $nin: 'Delivered' }
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

        res.status(200).json(activeOrders);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
    
});


const getNonActiveOrdersByBranch = catchAsyncError(async (req, res, next) => {
    try {
        const restaurantId = req.body.restaurantId;
        const nonActiveOrders = await Order.find({  
            restaurantId: restaurantId, 
            orderStatus: { $in: 'Delivered' } 
        }) //.populate('user', 'orderItems.product');

        res.status(200).json(nonActiveOrders);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

const getNotification = catchAsyncError(async (req, res, next) => {

    try {
        const restaurantId = req.query.restaurantId;
        const selectedDate = req.query.selectedDate;
  
        // Handle the case where restaurantId or selectedDate is not provided
        if (!restaurantId || !selectedDate) {
            return res.status(400).json({ error: 'restaurantId and selectedDate are required' });
        }
  
        const activeOrders = await Order.find({
            restaurantId,
            orderDate: selectedDate,
            orderStatus: { $nin: 'Delivered' }
        });
  
        const adminEmail = 'thulasi9941@gmail.com';
  
        // Function to calculate time difference and send reminder
        const calculateTimeDifferenceAndSendReminder = async (email, order) => {
          // Combine orderDate, selectedTimeSlot, and current year to create a valid Date object
          const currentYear = new Date().getFullYear();
          const combinedDateTimeString = `${order.orderDate}/${currentYear} ${order.selectedTimeSlot}`;
          const orderDateTime = new Date(combinedDateTimeString);
      
          // Calculate the time difference in minutes
          const timeDifferenceInMinutes = (orderDateTime - new Date()) / (1000 * 60);
      
          // Check if the order is within 60 minutes and hasn't been reminded yet
          if (timeDifferenceInMinutes <= 60 && timeDifferenceInMinutes > 0 && !order.reminderSent) {
              // Send order reminder email
            //   await sendOrderReminderEmail(email, order);
                
              // Update the order in the database to mark the reminder as sent
              await Order.findByIdAndUpdate(order._id, { reminderSent: true });
      
              // Send WebSocket notification
              sendWebSocketNotification(order);
              res.json({
                reminder: {
                    orderId: order._id,
                    message: `Order reminder for the id - ${order._id}.`
                }
            });
          }
      };
    
        // Iterate through active orders and send reminders
        for (const order of activeOrders) {
            await calculateTimeDifferenceAndSendReminder(adminEmail, order);
        }
  
        res.status(200).json(activeOrders);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

module.exports = {
    getActiveOrdersByBranch,
    getNonActiveOrdersByBranch,
    getNotification
};




// const getActiveOrdersByBranch = catchAsyncError(async (req, res, next) => {
//     try {
//         const restaurantId = req.body.restaurantId;
//         const activeOrders = await Order.find({ 
//              restaurantId,
//             orderStatus: { $nin: 'Delivered'} 
//         })

//         res.status(200).json(activeOrders);
//     } catch (error) {
//         next(new ErrorHandler(error.message, 500));
//     }
// });

// const getActiveOrdersByBranch = catchAsyncError(async (req, res, next) => {
//     try {
//         const restaurantId = req.query.restaurantId;
//         const selectedDate = req.query.selectedDate;

//         // Handle the case where restaurantId or selectedDate is not provided
//         if (!restaurantId || !selectedDate) {
//             return res.status(400).json({ error: 'restaurantId and selectedDate are required' });
//         }
       
//         const activeOrders = await Order.find({ 
//             restaurantId,
//             orderDate: selectedDate,
//             orderStatus: { $nin: 'Delivered'} 
//         });
      
//         res.status(200).json(activeOrders);
//     } catch (error) {
//         next(new ErrorHandler(error.message, 500));
//     }
// });