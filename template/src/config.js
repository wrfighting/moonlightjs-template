/**
 * 配置文件
 */

const _lodash = require('lodash')
const path = require('path')

//公共配置
const commonConfig = {
    applogFileName: path.join(__dirname, '../log/all.log'),
}

let file = ''
console.log('process.env', process.env.NODE_ENV)
let env = process.env.NODE_ENV || 'development'
env = env.toLowerCase()

switch (env) {
    case 'development':
        file = './config/dev.env'
        break
    case 'production':
        file = './config/prod.env'
        break
    case 'pre':
        file = './config/pre.env'
        break
    default:
        file = './config/dev.env'
        break
}

try {
    let privateConfig = require(file)
    module.exports = _lodash.extend(commonConfig, privateConfig)
} catch (err) {
    console.error('Cannot load config: [%s] %s', env, file)
    throw err
}
