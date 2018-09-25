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
                // TODO: catch error by types
                return ctx.status = 500;
            }
            
        });

module.exports = router;