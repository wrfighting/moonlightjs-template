# <$ name $>

> a world-classic project

建议node 10以上
## Usage

```bash
# install all this dependencies.
npm run i

# development, default port: 3000
npm run dev

# pre
npm run pre

# production
npm run prod

# 上线 使用pm2作为守护进程
正式集群 npm run pmprod  端口默认3000
预发集群 npm run pmpre 端口默认8011


# unit test 由于使用了mocha 8，所以单测要求node版本>10.12.0
npm run test

# 单测覆盖率
npm run cover
然后在coverage文件夹里的index.html查看详情


```
