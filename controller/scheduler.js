const Model = global.model;
const Moment = require('moment');
const conf = require('../config/conf');
const request = require('request');

const RequestAsync = (url, qsObj) => {
    return new Promise((resolve, reject) => {
        request({
            method: 'POST',
            uri: url,
            qs: qsObj,
        }, (error, resp) => {
            if (error)
                reject(error);

            resolve(resp.statusCode);
        })
    })
}


module.exports = {
    CheckOfflineDevices: async () => {
        const ExpiredSec = conf.expiredSec;
        const now = Moment().format('X');

        // Get All OnlineSet
        const [allHeartbeats, onlineList] = await Promise.all([
            Model.GetAllHeartbeats(),
            Model.GetAllOnlineStats(),
        ])

        const deviceList = allHeartbeats.map(device => ({
            deviceid: device.id,
            heartbeat: device.hb,
            isonline: onlineList.include(device.id) ? 1 : 0,
        }));

        // Check heartbeat is expired or not
        const turnToOfflineList = deviceList.filter(device => {
            return device.isonline === 1 && (now - device.heartbeat > ExpiredSec);
        });

        // Del from OnlineSet
        // Set to WarningSet  
        const ids = turnToOfflineList.map(device => device.id);
        Model.RemFromOnlineSet(ids);
        Model.AddToWarningSet(ids);

        global.logger.debug(`Turn to Offline: ${ids.join(',')}`);
    },

    SendWarning: async () => {
        // Get All WarningZSet
        const warningList = await Model.GetAllWarning();

        for (const device of warningList) {
            // Check Warning Count
            if (device.cnt >= 2)
                continue;

            try {
                // prepare webhook querystring
                const hb = await Model.GetHeartbeat(device.id);
                const heartbeat = Moment.unix(hb).toISOString();
                const qsObj = {
                    device_id: device.id,
                    last_updated: heartbeat,
                }

                // Call Webhook
                const statusCode = await RequestAsync(conf.webhook, qsObj);

                if (statusCode === 200) {
                    // Incr to WarningZSet
                    Model.IncWarningCount(device.id);
                }
            }
            catch (error) {
                global.logger.warn(`${error.message}`);
            }
        }

    }
}