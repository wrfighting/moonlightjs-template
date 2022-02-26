/**
 * superagent的promise化  进行收口并解决各种坑 比如bigint
 */

const superagent = require('superagent')
const _ = require('lodash')
const qs = require('qs')
const JSONbig = require('json-bigint')({ storeAsString: true })

/**
 * 发起请求
 * @param type 类型 get post del put file
 * @param url
 * @param data
 * @param timeout
 * @param fileUrl  文件url地址
 * @returns {Promise}
 */
function request (
    url = '',
    {
        type = 'GET',
        data = {},
        timeout = 5000,
        fileUrl = null,
        cookie = null,
        header = null,
        json = false,
        form = false,
        ctx = null,
        ok = false,
        returnReq = false,
    } = {},
) {
    type = type.toLowerCase()

    if (type === 'delete') {
        type = 'del'
    }

    let logger = console

    if (ctx && ctx.logger) {
        logger = ctx.logger
    }

    let superObj = superagent[type](url)
        .set('Content-Type', 'application/json')
        .timeout(timeout)

    if (form) {
        superObj = superObj.type('form')
    }

    superObj = superObj.buffer(true)

    superObj = superObj.parse((res, cb) => myParser(res, cb, json))

    if (json) {
      superObj = superObj.parse(superagent.parse['application/json'])
    }

    if (ok) {
        superObj = superObj.ok(res => res.status < 600)
    }

    if (header) {
        header = _.omit(header, ['host', 'content-length'])
        superObj = superObj.set(header)
    }

    if (cookie && !_.isEmpty(cookie)) {
        superObj = superObj.set('Cookie', cookie)
    }

    if (type === 'get' || type === 'del') {
        if (data && !_.isEmpty(data)) {
            superObj = superObj.query(qs.stringify(data))
        }
    } else if (fileUrl && fileUrl.length > 0) {
        if (data && !_.isEmpty(data)) {
            for (let key in data) {
                superObj = superObj.field(key, data[key])
            }
        }
        fileUrl.forEach(item => {
            superObj = superObj.attach(
                item.name,
                item.file,
                item.options,
            )
        })
    } else {
        if (data) {
            superObj = superObj.send(data)
        }
    }

    if (returnReq === true) {
        return superObj
    }

    return new Promise((resolve, reject) => {
        const startTime = new Date()
        superObj.end((err, res) => {
          const endTime = new Date()
            const tll = endTime.getTime() - startTime.getTime()
            if (err) {
                let resInfo = ''
                let remote = false

                if (err && err.rawResponse) {
                    resInfo = err.rawResponse
                    remote = true
                }

                if (res && res.body) {
                    resInfo = res.body
                }

                logger.error(
                    'agent_request_fail' + err,
                    {
                        agent_url: url,
                        agent_method: type,
                        agent_data: data,
                        agent_res: resInfo,
                        agent_ttl: tll,
                        agent_code: res && res.status,
                    },
                    { logPrefix: '_com_http_failure' }
                )

                reject({ err: err, result: resInfo, remote: remote })
            } else {
              if (_.isEmpty(res.body) && res.text) {
                logger.log(
                  'agent_request_success',
                  {
                    agent_url: url,
                    agent_method: type,
                    agent_data: data,
                    agent_res: res.text,
                    agent_ttl: tll,
                    agent_code: res && res.status,
                  },
                  { logPrefix: '_com_http_success' }
                )
              } else {
                logger.log(
                  'agent request success',
                  {
                    agent_url: url,
                    agent_method: type,
                    agent_data: data,
                    agent_res: res.body,
                    agent_ttl: tll,
                    agent_code: res && res.status,
                  },
                  { logPrefix: '_com_http_success' }
                )
              }
            }
            resolve(res)
        })
    })
}

function myParser(res, cb, json) {
    const mime =
        (res.headers['content-type'] || '').split(/ *; */).shift() ||
        'text/plain'
    const type = mime.split('/')[0]
    const responseType = res._responseType

    if (json) {
        parseJSON(res, cb)
    } else if (responseType) {
        parseBinary(res, cb)
    } else if ('text' === type) {
        parseText(res, cb)

        // everyone wants their own white-labeled json
    } else if (mime === 'application/x-www-form-urlencoded') {
        parseUrlencode(res, cb)
    } else if (mime === 'application/json') {
        parseJSON(res, cb)
    } else if (['application/octet-stream', 'application/pdf'].includes(mime)) {
        parseBinary(res, cb)
    } else if (isJSON(mime)) {
        parseJSON(res, cb)
    } else {
        parseText(res, cb)
    }
}

function parseUrlencode(res, fn) {
    res.text = ''
    res.setEncoding('ascii')
    res.on('data', chunk => {
        res.text += chunk
    })
    res.on('end', () => {
        try {
            fn(null, qs.parse(res.text))
        } catch (err) {
            fn(err)
        }
    })
}

function parseJSON(res, fn) {
    res.text = ''
    res.setEncoding('utf8')
    res.on('data', chunk => {
        res.text += chunk
    })
    res.on('end', () => {
        try {
            var body = res.text && safeJSONParse(res.text)
        } catch (e) {
            var err = e
            // issue #675: return the raw response if the response parsing fails
            err.rawResponse = res.text || null
            // issue #876: return the http status code if the response parsing fails
            err.statusCode = res.statusCode
        } finally {
            fn(err, body)
        }
    })
}

function parseBinary(res, fn) {
    const data = [] // Binary data needs binary storage

    res.on('data', chunk => {
        data.push(chunk)
    })
    res.on('end', () => {
        fn(null, Buffer.concat(data))
    })
}

function parseText(res, fn) {
    res.text = ''
    res.setEncoding('utf8')
    res.on('data', chunk => {
        res.text += chunk
    })
    res.on('end', fn)
}

function isJSON(mime) {
    // should match /json or +json
    // but not /json-seq
    return /[\/+]json($|[^-\w])/.test(mime)
}

function safeJSONParse(jsonString) {
    return JSONbig.parse(jsonString)
}

module.exports = request
