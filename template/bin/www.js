const app = require('../src/app')
const config = require('../src/config')

const server = app.listen(config.port, function () {
    console.log(`server is running at port ${config.port}`)
})

module.exports = server
