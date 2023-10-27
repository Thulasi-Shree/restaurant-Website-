
const app = require('./app');
const connectDatabase = require('./config/database');
const http = require('http');
const initializeWebSocket = require('./utils/websocket');

const server = http.createServer(app);
const io = initializeWebSocket(server);

connectDatabase();

 
server.listen(process.env.WSPORT, () => {
    console.log(`WebSocket server listening on port ${process.env.WSPORT}`);
});


const index = app.listen(process.env.PORT, () => {
    console.log(`My Server listening to the port: ${process.env.PORT} in  ${process.env.NODE_ENV} `)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    index.close(() => {
        process.exit(1);
    })
})

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    index.close(() => {
        process.exit(1);
    })
})

app.set('io', io);