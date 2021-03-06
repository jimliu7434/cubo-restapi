module.exports = {
    redis: {
        host: '127.0.0.1',
        port: 6379,
        socket_keepalive: true,
    },
    expiredSec: 120,
    checkMin: 3,
    maxAlertTimes: 2,
    webhook: 'https://5qaeek7sj0.execute-api.us-east-1.amazonaws.com/dev/webhook',
}