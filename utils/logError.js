const winston = require('winston');

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(), 
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log' }) 
    ]
});

const logError = (error) => {
    logger.error(error); 
};

module.exports = { logError };
