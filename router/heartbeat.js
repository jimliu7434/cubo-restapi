const router = new (require('koa-router'));
const heartbeat = require('../controller/heartbeat');

router.get('/:deviceid',
    (ctx, next) => {
        // TODO: Check deviceid is an UUID or not

    },
    async (ctx) => {
        try {
            const { deviceid } = ctx.params;
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