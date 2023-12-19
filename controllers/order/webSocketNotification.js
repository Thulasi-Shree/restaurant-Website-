const WebSocket = require('ws');
const ws = new WebSocket('ws://your-website-ws-endpoint'); 
const catchAsyncError = require('../../middlewares/catchAsyncError');
const Order = require('../../model/order');
const ErrorHandler = require('../../utils/errorHandler');
const {sendOrderReminderEmail} = require('../../utils/email');

const getActiveOrdersByBranchWs = catchAsyncError(async (req, res, next) => {
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
      const sendWebSocketNotification = (order) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'order_reminder', orderId: order._id }));
        }
    };

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
            await sendOrderReminderEmail(email, order);
    
            // Update the order in the database to mark the reminder as sent
            await Order.findByIdAndUpdate(order._id, { reminderSent: true });
    
            // Send WebSocket notification
            sendWebSocketNotification(order);
        }
    };
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      if (data.type === 'order_reminder') {
          console.log(`Received order reminder for orderId: ${data.orderId}`);
          // Handle the WebSocket notification on the website
          // You can use this information to display a notification to the user
      }
  });
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
  getActiveOrdersByBranchWs
};