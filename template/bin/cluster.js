/*
  cluster模式，生产环境使用
 */
const cluster = require('cluster')
const path = require('path')
const config = require('../src/config')
const logger = require('../src/common/util/logger')

cluster.setupMaster({
    exec: path.join(__dirname, 'worker.js'),
})

let instance = config.instance || 1

if (config.cluster_mode === 'default') {
    instance = require('os').cpus().length
}

for (let i = 0; i < instance; i++) {
    cluster.fork()
}

logger.log(`master is done at ${process.pid}`)

cluster.on('disconnect', function (worker) {
    const w = cluster.fork()
    console.error(
        '[%s] [master:%s] worker:%s disconnect! new worker:%s fork',
        Date(),
        process.pid,
        worker.process.pid,
        w.process.pid
    )
})

cluster.on('exit', function (worker) {
    console.error(
        '[%s] [master:%s] worker:%s exit!',
        Date(),
        process.pid,
        worker.process.pid
    )
})
