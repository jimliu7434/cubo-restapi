const Redis = require('ioredis');

class RedisModel {
    constructor() {
        this.redis = new Redis({
            host: '127.0.0.1',
            port: 6379,
            socket_keepalive: true,
        });
    }

    async GetStat(id) {

    }

    async SetStat(id) {

    }

    async GetAllStats() {

    }

    async CheckOnlineStats () {

    }

    async MoveToOffline(idList) {

    }

    async MoveToOnline(idList) {

    }
}

module.exports = RedisModel;