const winston = require('winston');
require('winston-daily-rotate-file');
const mkdirp = require('mkdirp');
const Koa = require('koa');
const Schedule = require('node-schedule');

// init folders
mkdirp('./logs');

// init logger
global.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: ['dev', 'uat'].includes(process.env.NODE_ENV) ? 'debug' : 'info',
            colorize: true,
            timestamp() {
                return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            },
            json: false,
            handleExceptions: true,
            humanReadableUnhandledException: true,
        }),
        new (winston.transports.DailyRotateFile)({
            timestamp() {
                return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
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
const port = Number(process.env.WEBPORT) || 80;
const app = new Koa();

// router
app.use('/heartbeat', (require('./router/heartbeat')).routes());
app.use('/device', (require('./router/device')).routes());
app.use('/devices', (require('./router/devices')).routes());


app.listen(port, () => {
    logger.info(`listening ${port}`);
});

// init Schedule
const scheduler = require('./controller/scheduler');
Schedule.scheduleJob('CheckDevices', ' 0 */5 * * *', async () => {
    await scheduler.CheckOnlineDevices();
    await scheduler.SendWarning();
});

