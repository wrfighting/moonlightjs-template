const Sequelize = require('sequelize')
const config = require('../config')
const sequelize = new Sequelize(
    config.mysql_options.dataBase,
    config.mysql_options.account,
    config.mysql_options.pwd,
    config.mysql_options.options
)

module.exports = sequelize
