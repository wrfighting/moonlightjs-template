const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const logger = require('viper-log')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const middleware = require('./common/middleware')
const router = require('./router/router')
const config = require('./config')

const app = new Koa()

app.use(bodyParser())

logger.setOptions({
    env: process.env.NODE_ENV,
    logToConsole: config.logToConsole,
    applog: {
        fileName: config.applogFileName,
    },
})

app.use(
    logger.initLogKoa({
        skipMethod: ['OPTIONS'],
    })
)

app.use(middleware.common)
app.use(middleware.error)

app.use(conditional())
app.use(etag())

app.use(router.routes()).use(router.allowedMethods())

module.exports = app
