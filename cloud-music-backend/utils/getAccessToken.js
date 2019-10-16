const rp = require('request-promise')
const APPID = 'wx6e2dbc8db3f38ba2'
const APPSECRET = '70c717c5f8e45547c620500acfb9a318'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json') 

const updateAccessToken = async () => {
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    // console.log(res)
    //写文件,保存token在utils/access_token.json文件里
    if(res.access_token){
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        //没有获取到token，需要再次获取，再次调用，异步方法
        await updateAccessToken()
    }
}

const getAccessToken = async () => {
    //读取文件
    try {
        const readRes = fs.readFileSync(fileName, 'utf8')
        const readObj = JSON.parse(readRes)
        const createTime = new Date(readObj.createTime).getTime()
        const nowTime = new Date().getTime()
        if((nowTime - createTime) / 1000 / 60 / 60){
            await updateAccessToken()
            await getAccessToken()  
        }
        return readObj.access_token
    } catch (error) {
        await updateAccessToken()
        await getAccessToken()
    }
}

setInterval(async ()=>{
    await updateAccessToken()
}, (7200 -300)*1000)

// updateAccessToken()
// getAccessToken()
module.exports = getAccessToken