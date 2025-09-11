// utils/logger.js - Vercel compatible
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Remove file transports for Vercel
// Vercel filesystem is read-only except /tmp
if (process.env.NODE_ENV === 'production') {
  logger.clear();
  logger.add(new winston.transports.Console({
    level: 'warn'
  }));
}

module.exports = logger;