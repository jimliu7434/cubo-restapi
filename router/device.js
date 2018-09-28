const router = new (require('koa-router'));
const device = require('../controller/device');
const Check = require('../common/check');

router.get('/:deviceid',
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
            const body = await device.GetStat(deviceid);
            if (body === null) {
                return ctx.status = 204;
            }
            else {
                ctx.body = body;
                return ctx.status = 200;
            }
        }
        catch (error) {
            global.logger.error(`${error.message}`);
            return ctx.status = 500;
        }
    }
);

module.exports = router;