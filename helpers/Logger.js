// helpers/logger.js
const { createLogger, format, transports } = require("winston");
const AllureTransport = require("./AllureTransport");

const COLORS = {
  info: "\x1b[32m",
  debug: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};
const RESET = "\x1b[0m";

const consoleFormat = format.printf(({ level, message, timestamp }) => {
  const color = COLORS[level] || "";
  return `${timestamp} ${color}${level}${RESET}: ${message}`;
});

const plainFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "debug",
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        consoleFormat
      ),
    }),

    new AllureTransport({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        plainFormat
      ),
    }),
  ],
});

module.exports = logger;
