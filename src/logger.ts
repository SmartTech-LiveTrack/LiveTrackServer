import winston, { format } from 'winston';

import { IS_PRODUCTION_ENV, IS_TEST_ENV } from "./config/constants";

const consoleTransport = new winston.transports.Console()
const consoleLogger = winston.createLogger({
    transports: [consoleTransport]
});

const { combine, timestamp, printf } = format;
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});


const fileLogger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

function logRequestInProduction(req, res, next) {
    consoleLogger.info(req.url)
    next()
}

function logRequestInDev(req, res, next) {
    consoleLogger.info(req.url)
    next()
}

function logErrorInProduction(err, req, res, next) {
    consoleLogger.error(err.message);
    next(err);
}

function logErrorInDev(err, req, res, next) {
    consoleLogger.error(err.message);
    next(err);
}

export function logRequest(req, res, next) {
    if (IS_PRODUCTION_ENV) {
        logRequestInProduction(req, res, next);
    } else if (!IS_TEST_ENV) {
        logRequestInDev(req, res, next);
    } else {
        next();
    }
}

export function logError(err, req, res, next) {
    if (IS_PRODUCTION_ENV) {
        logErrorInProduction(err, req, res, next);
    } else {
        logErrorInDev(err, req, res, next);
    }
}