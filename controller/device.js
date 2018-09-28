const Model = global.model;

module.exports = {
    /**
     * 
     */
    GetStat: async (id) => {
        // Get Heartbeat
        // Get Stat
        const [heartbeat, isonline] = await Promise.all([
            Model.GetHeartbeat(id),
            Model.GetStat(id),
        ]);
        return {
            deviceid: id,
            heartbeat,
            isonline,
        };
    },
}