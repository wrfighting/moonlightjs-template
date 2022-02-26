const dogService = require('../../service/dogs')

function Dogs() {}

Dogs.sayHi = async ctx => {
  ctx.body = dogService.getLanguage('en') + ' Hi'
}

module.exports = Dogs
