const router = new (require('koa-router'));
const device = require('../controller/device');

router.get('/:deviceid',
    (ctx, next) => {
        // TODO: Check deviceid is an UUID or not

    },
    async (ctx) => {
        try {
            const { deviceid } = ctx.params;
            const body = await device.GetStat(deviceid);
            ctx.body = body;
            return ctx.status = 200;
        }
        catch (error) {
            // TODO: catch error by types
            return ctx.status = 500;
        }

    }
);

module.exports = router;