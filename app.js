const winston = require('winston');
require('winston-daily-rotate-file');
const mkdirp = require('mkdirp');
const Koa = require('koa');
const Schedule = require('node-schedule');
const Moment = require('moment');
const Router = require('koa-router');
const conf = require('./config/conf');

// init folders
mkdirp('./logs');

// init logger
global.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug',
            colorize: true,
            timestamp() {
                return Moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            },
            json: false,
            handleExceptions: true,
            humanReadableUnhandledException: true,
        }),
        new (winston.transports.DailyRotateFile)({
            timestamp() {
                return Moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            },
            level: 'info',
            json: true,
            filename: './logs/dmsapi-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '50m',
            maxFiles: '30d',
            handleExceptions: true,
            humanReadableUnhandledException: true,
        }),
    ],
});

// init Data Model
global.model = new (require('./model/redis'))();

// init Koa
const app = new Koa();

// router
const root = new Router();
root.use('/heartbeat', (require('./router/heartbeat')).routes());
root.use('/device', (require('./router/device')).routes());
root.use('/devices', (require('./router/devices')).routes());
app.use(root.routes());

// init Schedule
const scheduler = require('./controller/scheduler');
Schedule.scheduleJob('CheckDevices', `*/${conf.checkMin} * * * *`, async () => {
    const now = await scheduler.CheckOfflineDevices();
    await scheduler.SendWarning();
    global.logger.info(`CheckDevices Completed at ${now}`);
});

module.exports = { app, model: global.model, conf } ;