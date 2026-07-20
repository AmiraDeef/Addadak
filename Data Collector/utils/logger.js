const winston = require('winston');
const config = require('../config/index')
const path = require('path');

const logDirectory = path.join(__dirname, '..', 'logs');

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
    level: config.env === "dev" ? 'debug' : 'info',
    format:logFormat,
    transports:[
        new winston.transports.File({ filename: path.join(logDirectory,'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDirectory,'combined.log')}),
    ]   
});

//To print the logger on the screen.

if (config.env === 'dev') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        return `[${timestamp}] ${level}: ${stack || message}`;
      })
    ),
  }));

}

module.exports = {logger} ;