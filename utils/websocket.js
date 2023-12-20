// // websocket.js
// const WebSocket = require('ws');
// const schedule = require('node-schedule');
// const Order = require('../model/order');

// const getActiveOrders = async (restaurantId, selectedDate) => {
//     try{  
//       const activeOrders = await Order.find({
//         restaurantId,
//         orderDate: selectedDate,
//         orderStatus: { $nin: 'Delivered' }
//       });
  
//       return activeOrders;
//     } catch (error) {
//       throw error;
//     }
//   };
//   const getOrderDateTime = (order) => {
//     const currentYear = new Date().getFullYear();
//     const combinedDateTimeString = `${order.orderDate}/${currentYear} ${order.selectedTimeSlot}`;
//     return new Date(combinedDateTimeString);
//   };
  
//   // Function to update the reminder status in the database (replace this with your actual implementation)
//   const updateOrderReminderStatus = async (orderId) => {
//     try {
//         console.log(`Reminder sent for order ID ${orderId}`);
//       // Replace the following line with your logic to update the order reminder status
//     //   For example, 
//       return Order.findByIdAndUpdate(orderId, { reminderSent: true });
      
//     } catch (error) {
//       console.log(error);
//     }
//   };

// const initializeWebSocketServer = (server) => {
//   const wss = new WebSocket.Server({ server });

//   wss.on('connection', (ws) => {
//     console.log('Client connected');

//     ws.on('message', (message) => {
//       console.log(`Received message: ${message}`);
//       // Handle the incoming message as needed
//     });

//     ws.on('close', () => {
//       console.log('Client disconnected');
//     });
//   });

//   // Schedule a job to send a reminder every minute (adjust as needed)
// //   const job = schedule.scheduleJob('* * * * *', () => {
// //     wss.clients.forEach((client) => {
// //       if (client.readyState === WebSocket.OPEN) {
// //         // Send an automatic reminder message to each connected client
// //         client.send('Automatic reminder from the server!');
// //       }
// //     });
// //   });
// const job = schedule.scheduleJob('* * * * *', async (req, res) => {
//     try {
//         // Replace these values with your actual logic to get restaurantId and selectedDate
//         // const restaurantId = req.user.restaurantId;

//         const activeOrders = await getActiveOrders();

//         const currentTime = new Date();

//         for (const order of activeOrders) {
//             const orderDateTime = getOrderDateTime(order);
//             const timeDifferenceInMinutes = (orderDateTime - currentTime) / (1000 * 60);

//             // Check if the order is within 60 minutes and hasn't been reminded yet
//             if (timeDifferenceInMinutes <= 60 && timeDifferenceInMinutes > 0 && !order.reminderSent) {
//                 // Send a WebSocket notification to connected clients
//                 wss.clients.forEach((client) => {
//                     if (client.readyState === WebSocket.OPEN) {
//                         client.send(`Order reminder for order ID ${order._id}`);
//                     }
//                 });

//                 // Update the order in the database to mark the reminder as sent
//                 await updateOrderReminderStatus(order._id);
//             }
//         }
//     } catch (error) {
//         console.error(error);
//     }
// });
// };

// module.exports = initializeWebSocketServer;


const WebSocket = require('ws');
const schedule = require('node-schedule');
const Order = require('../model/order');
const ErrorHandler = require('../utils/errorHandler');

const initializeWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
      // Handle the incoming message as needed
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  const job = schedule.scheduleJob('* * * * *', async () => {
    try {
      const adminEmail = 'thulasi9941@gmail.com';
      const selectedDate = new Date(); // Change this as needed

      const activeOrders = await Order.find({
        orderDate: selectedDate,
        orderStatus: { $nin: 'Delivered' }
      });

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
          // await sendOrderReminderEmail(email, order);
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(`Order reminder for order ID ${order._id}`);
              console.log(`Order reminder for order ID ${order._id}`);
            }
          });
          // Update the order in the database to mark the reminder as sent
          await Order.findByIdAndUpdate(order._id, { reminderSent: true });
        }
      };
  
      // Iterate through active orders and send reminders
      for (const order of activeOrders) {
        await calculateTimeDifferenceAndSendReminder(adminEmail, order);
        console.log('Reminder job executed successfully');
      }

    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = initializeWebSocketServer;
