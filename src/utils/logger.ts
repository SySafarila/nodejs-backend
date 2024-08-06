import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "errors.log",
    }),
  ],
});

export default logger;
