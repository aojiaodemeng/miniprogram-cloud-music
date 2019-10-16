// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("3",event)
  const { OPENID } = cloud.getWXContext()
  const result = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      keyword1: {
        value: '评价完成'
      },
      keyword2: {
        value: event.content
      }
    },
    //模板Id
    templateId: 'gaeNQpUTVo6t4xriqGh2urNaXSKqFx4sDKQbanwAYpE',
    formId: event.formId
  })
  return result
}