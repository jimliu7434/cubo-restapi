const Model = global.model;

module.exports = {
    /**
     * 
     */
    GetStat: async (id) => {
        // Get Heartbeat
        // Get Stat
        const [heartbeat, stat] = await Promise.all([
            Model.GetHeartbeat(id),
            Model.GetStat(id),
        ]);
        return {
            heartbeat,
            stat,
        };
    },
}