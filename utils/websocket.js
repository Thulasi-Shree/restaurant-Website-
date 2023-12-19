// const WebSocket = require('ws');
// const server = new WebSocket.Server({ port: 5000 });

// server.on('connection', (socket) => {
//     console.log('Client connected');

//     // Handle messages from clients
//     socket.on('message', (message) => {
//         console.log(`Received message: ${message}`);
//         // socket.send(`Server received your message: ${message}`);
//         const parsedMessage = JSON.parse(message);
//         socket.send(JSON.stringify({ type: 'response', originalMessage: parsedMessage }));
//         // You can handle different types of messages here
//     });

//     // Handle disconnection
//     socket.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// console.log('WebSocket server is running on port 5000');