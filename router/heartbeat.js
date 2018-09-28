const router = new (require('koa-router'));
const heartbeat = require('../controller/heartbeat');
const Check = require('../common/check');

router.post('/:deviceid',
    (ctx, next) => {
        const { deviceid = '' } = ctx.params;
        if (Check.IsUUID(deviceid))
            return next();
        else
            return ctx.status = 400;
    },
    async (ctx) => {
        try {
            const { deviceid } = ctx.params;
            global.logger.debug(`hb: ${deviceid}`);
            await heartbeat.SetStat(deviceid);
            return ctx.status = 200;
        }
        catch (error) {
            global.logger.error(`${error.message}`);
            return ctx.status = 500;
        }
    }
);

module.exports = router;