
import fs from 'fs';
import path from 'path';
import winston from 'winston';

const currentDir = __dirname;
const projectRoot = path.resolve(currentDir, '..', '..');
const loggingDir = path.join(projectRoot, 'logs');

fs.mkdirSync(loggingDir, { recursive: true });

const timeZone = 'Asia/Kolkata';

const formatTimestamp = (): string => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-IN', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);
};

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: formatTimestamp }),
    customFormat,
  ),
  transports: [
    new winston.transports.Console({ level: 'debug' }),
    new winston.transports.File({
      filename: path.join(loggingDir, 'test_run.log'),
      maxFiles: 5,
      maxsize: 300 * 1024,
      level: 'info',
    }),
    new winston.transports.File({
      filename: path.join(loggingDir, 'test_error.log'),
      maxFiles: 5,
      maxsize: 10 * 1024,
      level: 'error',
    }),
  ],
});

export default logger;
