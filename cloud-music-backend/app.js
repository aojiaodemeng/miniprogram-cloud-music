const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')

const ENV = 'dev-h1xqz'
//跨域
app.use(cors({
    origin: ['http://localhost:9528'],
    credentials: true
}))
//接收post参数解析
app.use(koaBody({
    multipart: true,
}))
app.use(async (ctx,next) => {
    // console.log('全局中间件')
    ctx.state.env = ENV
    await next()
})

const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')
router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())
router.use('/blog', blog.routes())

app.use(router.routes())


app.listen(4000, ()=>{
    console.log('服务开启在4000端口')
})