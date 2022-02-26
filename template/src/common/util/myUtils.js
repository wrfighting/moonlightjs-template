const JSONbig = require('json-bigint')

module.exports = {
    jsonToBase64(obj) {
        return new Buffer(JSON.stringify(obj)).toString('base64')
    },
    getTraceId(reqHeader) {
        if (reqHeader && reqHeader['traceid']) {
            return reqHeader['traceid']
        } else {
            return ''
        }
    },
    safeJSONParse(jsonString) {
        let myJson = JSONbig.parse(jsonString)
        for (let key in myJson) {
            if (typeof myJson[key] === 'object') {
                if (myJson[key]['s'] && myJson[key]['e'] && myJson[key]['c']) {
                    myJson[key] = myJson[key].toString()
                }
            }
        }
        return myJson
    },
}
