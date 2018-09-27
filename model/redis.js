const Redis = require('ioredis');
const Key = require('../common/keyGen');
const conf = require('../config/conf');

class RedisModel {
    constructor() {
        this.redis = new Redis(conf.redis);
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
        return existed;
    }

    /**
     * 
     * @param {*} id 
     * @param {*} isOnline 
     */
    async AddToOnlineSet(ids) {
        return await this.redis.sadd(Key.OnlineSet(), ...ids);
    }

    async RemFromOnlineSet(ids) {
        return await this.redis.srem(Key.OnlineSet(), ...ids);
    }

    async GetWarningCount(id) {
        const cnt = await this.redis.zscore(Key.WarningSet(), id);
        return cnt || 0;
    }

    async IncWarningCount(id) {
        return await this.redis.zincrby(Key.WarningSet(), 1, id);
    }

    async AddToWarningSet(ids) {
        const r = ids.map(id => { return [0, id]; });
        return await this.redis.zadd(Key.WarningSet(), ...r);
    }

    async RemFromWarningSet(ids) {
        return await this.redis.zrem(Key.WarningSet(), ...ids);
    }

    async GetAllHeartbeats() {
        const keys = await this.redis.keys(Key.Heartbeat('*'));
        if (keys.length <= 0)
            return [];

        const values = await this.redis.mget(...keys);
        let i = 0;
        const list = keys.map(k => {
            return {
                id: k,
                hb: values[i++] || 0,
            }
        });

        return list;
    }

    async GetAllOnlineStats() {
        return await this.redis.smembers(Key.OnlineSet());
    }

    async GetAllWarning() {
        const warningList = await this.redis.zrange(Key.WarningSet(), 0, -1, 'WITHSCORES');
        const rtn = [];
        const chunk = 2;
        for (let i = 0, len = warningList.length; i < len; i += chunk) {
            rtn.push(warningList.slice(i, i + chunk));
        }
        return rtn.map(d => ({
            id: d[0],
            cnt: d[1] || 0,
        }));
    }
}

module.exports = RedisModel;