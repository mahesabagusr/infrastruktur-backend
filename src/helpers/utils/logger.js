import winston from "winston";

const logFotmat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFotmat
  ),

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFotmat),
    }),

    new winston.transports.File({ filename: "logs/error.log", level: "error", maxsize: 10485760 }), // 10MB max size

    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
