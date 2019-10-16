// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  // app.use 表示该中间件会适用于所有的路由
  app.use(async (ctx, next) => {
    console.log('进入全局中间件')
    ctx.data = {};
    ctx.data.openId = event.userInfo.openId
    await next(); // 执行下一中间件
    console.log('退出全局中间件')
  });

  // 路由为字符串，该中间件只适用于 music 路由
  app.router('music', async (ctx, next) => {
    console.log('进入音乐名称中间件')
    ctx.data.musicName = '虫儿飞'
    await next(); // 执行下一中间件
    console.log('退出音乐名称中间件')
  }, async (ctx, next) => {
    console.log('进入音乐类型中间件')
    ctx.data.musicType = '儿歌'
    // ctx.body 返回数据到小程序端
    ctx.body = { 
      data: ctx.data
     };
    console.log('退出音乐类型中间件')
  })

  // 路由为字符串，该中间件只适用于 movie 路由
  app.router('movie', async (ctx, next) => {
    console.log('进入电影名称中间件')
    ctx.data.movieName = '千与千寻'
    await next(); // 执行下一中间件
    console.log('退出电影名称中间件')
  }, async (ctx, next) => {
    console.log('进入电影类型中间件')
    ctx.data.movieType = '日本动画片'
    // ctx.body 返回数据到小程序端
    ctx.body = {
      data: ctx.data
    };
    console.log('退出电影类型中间件')
  })

  return app.serve();
}