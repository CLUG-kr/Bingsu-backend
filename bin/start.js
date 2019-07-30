// NODE_ENV 확인후 global.config 변수 설정
const path = require('path');
if (!process.env.NODE_ENV)
    throw new Error('Tell me whether it is production or development by setting NODE_ENV');
else if (process.env.NODE_ENV.trim().toLowerCase() == 'production')
    global.config = require(path.join(__dirname, '..', 'config/production.json'));
else if (process.env.NODE_ENV.trim().toLowerCase() == 'development')
    global.config = require(path.join(__dirname, '..', 'config/dev.json'))
else
    throw new Error('Unable to understnad NODE_ENV! NODE_ENV must be production or development');

let koa = require('koa'),
    router = require('../src/routes'),
    app = new koa();

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.httpPort)