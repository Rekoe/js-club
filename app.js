import Koa from 'koa';
import co from 'co';
import render from 'koa-ejs';
import path from 'path';
import Router from 'koa-router';
import session from 'koa-session';
import convert from 'koa-convert';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';

const app = new Koa();

app.use(serve(__dirname + '/public/')); //静态文件目录
app.use(bodyParser());

//模板引挚设置
render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: true
});
app.context.render = co.wrap(app.context.render);


//session
app.keys = ['hwl'];

let CONFIG = {
  key: 'huweiliang app', 
  maxAge: 86400000, 
  overwrite: true, 
  httpOnly: true, 
  signed: true
};
app.use(session(CONFIG, app));

/**
 * 路由
 */
// 请求路由日志
const router = Router();
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
// 路由管理
require('./router')(router);
// 加载路由中间件
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000, happy it!');
