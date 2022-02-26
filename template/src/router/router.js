/**
 * 路由规范
 * 1.建议加prefix前缀，方便op配置nginx转发
 * 2.对外统一public二级前缀  对内api二级前缀
 * 3.遵守restful
 */
const router = require('koa-router')()

{% if mysql %}
const Cat = require('../controller/cats/cats')
{% endif %}
const Dog = require('../controller/dogs/dogs')

const prefix = '/<$ name $>'

router.get(`${prefix}/public/dogs/hi`, Dog.sayHi)

{% if mysql %}
router.get(`${prefix}/public/cats/hello`, Cat.sayHello)

//分页查询
router.get(`${prefix}/api/cats`, Cat.pageQuery)
//新增
router.post(`${prefix}/api/cats`, Cat.create)
//批量新增
router.post(`${prefix}/api/cats/bulk`, Cat.create)
//查询列表
router.get(`${prefix}/api/cats/list`, Cat.getList)
//获取单个
router.get(`${prefix}/api/cats/:id`, Cat.getSingle)
//编辑单个
router.put(`${prefix}/api/cats/:id`, Cat.update)
//批量编辑
router.put(`${prefix}/api/cats`, Cat.update)
//删除单个
router.delete(`${prefix}/api/cats/:id`, Cat.delete)
{% endif %}

module.exports = router
