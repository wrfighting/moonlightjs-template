const logger = require('viper-log')
const config = require('../../config')

logger.setOptions({
    env: process.env.NODE_ENV,
    logToConsole: config.logToConsole,
    applog: {
        fileName: config.applogFileName,
    },
})

module.exports = logger
