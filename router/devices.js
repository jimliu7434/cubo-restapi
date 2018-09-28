const router = new (require('koa-router'));
const devices = require('../controller/devices');

router.get('/',
        async (ctx) => {
            try {
                const body = await devices.GetAllStats();
                ctx.body = body;
                return ctx.status = 200;
            }
            catch (error) {
                global.logger.error(`${error.message}`);
                return ctx.status = 500;
            }   
        });

module.exports = router;