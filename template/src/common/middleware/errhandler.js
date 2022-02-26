/**
 * 异常处理
 * 生产环境隐藏详细错误信息500返回
 * myError用于过滤业务方自定义错误，返回其他错误码
 */

module.exports = async function (ctx, next) {
    try {
        await next()
    } catch (err) {
        let code = (err && err.status) || (err && err.err && err.err.status)
        let isMyError = false
        if (code) {
            ctx.status = code
        } else {
            ctx.status = 500
            isMyError = true
        }

        if (err.myError && err.myType === 1) {
            ctx.status = 200
            code = err.message
        }

        let data = 'server something is error'

        if (process.env.NODE_ENV !== 'production') {
            data = {
                errMsg: err,
                errStack: err.stack,
            }
        }

        ctx.body = ctx.util.refail(1, code, data)

        let errInfo = err

        if (!isMyError) {
            errInfo = JSON.stringify(err)
        }

        if (ctx.logger) {
            if (isMyError) {
                ctx.logger.error(`${errInfo}-${errInfo.stack}`)
            } else {
                ctx.logger.error(errInfo)
            }
        } else {
            console.error(errInfo)
            console.error(
                ctx.request.method,
                ctx.request.originalUrl,
                ctx.status
            )
        }
        // ctx.app.emit('error', err, ctx);
    }
}
