const Model = global.model;

module.exports = {
    /**
     * 
     */
    GetAllStats: async () => {
        // Get All Heartbeat 
        // Get All OnlineSet
        const [allHeartbeats, onlineList] = await Promise.all([
            Model.GetAllHeartbeats(),
            Model.GetAllOnlineStats(),
        ])
        
        return allHeartbeats.map(device => ({
            deviceid: device.id,
            heartbeat: device.hb,
            isonline: onlineList.include(device.id) ? 1 : 0,
        }));
    },
}