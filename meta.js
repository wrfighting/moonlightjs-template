module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: '项目名称'
    },
    description: {
      type: 'string',
      required: false,
      message: '项目描述',
      default: 'a world-classic project base on koajs'
    },
    author: {
      type: 'string',
      message: '作者'
    },
    mysql: {
      message: '是否需要使用mysql？',
      type: 'confirm',
      default: false
    },
    redis: {
      message: '是否需要使用redis？',
      type: 'confirm',
      default: false
    },
    eslint: {
      type: 'confirm',
      message: '是否需要ESlint',
      default: true
    },
    unitTest: {
      type: 'confirm',
      message: '是否需要单元测试',
      default: false
    },
  },
  filters: {
    '.eslintignore': 'eslint',
    '.eslintrc.js': 'eslint',
    '.prettierrc': 'eslint',
    '.lintstagedrc': 'eslint',
    'test/**/*': 'unitTest',
    'src/db/mysql.js': 'mysql',
    'src/controller/cats/*': 'mysql',
    'src/model/*': 'mysql',
    'src/db/redis.js': 'redis',
  },
  complete: function (data, { chalk }) {
    const green = chalk.green
    console.log(green('complete!'))
  },
}
