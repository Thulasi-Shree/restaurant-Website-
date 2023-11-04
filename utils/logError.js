const winston = require('winston');
const { format } = winston;
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

const logger = winston.createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new winston.transports.Console(),
    transport
  ]
});

module.exports = logger;




// const winston = require('winston');

// const logger = winston.createLogger({
//     level: 'error',
//     format: winston.format.json(), 
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'error.log' }) 
//     ]
// });

// const logError = (error) => {
//     logger.error(error); 
// };

// module.exports = { logError };
