const Model = global.model;
const Moment = require('moment');

module.exports = {
    SetStat: async (id) => {
        // Set new Heartbeat
        Model.SetHeartbeat(id, Moment().format('X'));
        // Set Stat to Online
        Model.AddToOnlineSet([id]);
        // Del from WarningZSet if exist
        Model.RemFromWarningSet([id]);
    },
}