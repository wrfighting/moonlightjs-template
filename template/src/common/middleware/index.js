exports.error = require('./errhandler')

const { utils } = require('lowcode-controller')
const myUtils = require('../util/myUtils')
const codeMap = require('../const/code_map')

exports.common = async function (ctx, next) {
    ctx.set('X-Trace-Id', ctx.headers['traceid'])

    ctx.util = {
        resuccess(data) {
            return {
                errno: 0,
                errmsg: codeMap['0'],
                data: data || null,
            }
        },
        refail(code = 1, message, data) {
            return {
                errno: code,
                errmsg: message || codeMap[code],
                data: data || null,
            }
        },
        validator: utils.validator.validateJson,
        myUtils: myUtils,
    }
    await next()
}
