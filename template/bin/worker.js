/*
  cluster模式，生产环境使用
 */

const config = require('../src/config')
const PORT = process.env.PORT || config.port
const graceful = require('graceful')
const server = require('../src/app')

server.listen(PORT)
console.log(
    '[%s] [worker:%s] web server start listen on %s',
    new Date(),
    process.pid,
    PORT
)

graceful({
    server: [server],
    killTimeout: 10000,
    error: function (err, throwErrorCount) {
        // 可以添加埋点捕获非正常退出
        if (err.message) {
            err.message +=
                ' (uncaughtException throw ' +
                throwErrorCount +
                ' times on pid:' +
                process.pid +
                ')'
        }
        console.error(err)
    },
})
