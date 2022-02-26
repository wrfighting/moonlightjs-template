const Redis = require('ioredis')
const config = require('../config')

const redis = new Redis(config.redis_options)

redis.on('connect', function () {
    console.log('redis connect success')
})

redis.on('error', function (err) {
    console.error(err)
})

module.exports = redis
