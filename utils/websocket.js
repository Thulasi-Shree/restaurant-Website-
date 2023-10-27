const socketIO = require('socket.io');

function initializeWebSocket(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
      console.log('Received message:', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}

module.exports = initializeWebSocket;
