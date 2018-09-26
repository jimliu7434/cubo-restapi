const Redis = require('ioredis');
const Key = require('../common/keyGen');

class RedisModel {
    constructor() {
        this.redis = new Redis({
            host: '127.0.0.1',
            port: 6379,
            socket_keepalive: true,
        });
    }

    /**
     * 
     * @param {*} id 
     */
    async GetHeartbeat(id) {
        return await this.redis.get(Key.Heartbeat(id));
    }

    /**
     * 
     * @param {*} id 
     * @param {*} unixStamp 
     */
    async SetHeartbeat(id, unixStamp) {
        return await this.redis.set(Key.Heartbeat(id), unixStamp);
    }

    /**
     * 
     * @param {*} id 
     */
    async GetStat(id) {
        const existed = await this.redis.sismember(Key.OnlineSet(), id);
        return (existed === 1);
    }

    /**
     * 
     * @param {*} id 
     * @param {*} isOnline 
     */
    async SetStat(id, isOnline = 0) {
        if(isOnline === 1)
            return await this.redis.sadd(Key.OnlineSet(), id);
        else
            return await this.redis.srem(Key.OnlineSet(), id);
    }

    async GetWarningCount (id) {
        const cnt = await this.redis.zscore(Key.WarningSet(), id);
        return cnt || 0;
    }

    async IncWarningCount (id) {
        return await this.redis.zincrby(Key.WarningSet(), 1, id);
    }

    async GetAllHeartbeats() {
        const keys = await this.redis.keys(Key.Heartbeat('*'));
        if(keys.length <= 0)
            return [];
        
        const values = await this.redis.mget(...keys);
        let i = 0;
        const list = keys.map(k => {
            return {
                key: k,
                value: values[i++] || 0,
            }
        });

        return list;
    }

    async GetAllOnlineStats() {
        return await this.redis.smembers(Key.OnlineSet());
    }
}

module.exports = RedisModel;