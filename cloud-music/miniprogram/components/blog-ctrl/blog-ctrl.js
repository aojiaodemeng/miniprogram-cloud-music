let userInfo = {}
const db = wx.cloud.database()
Component({
  properties: {
    blogId: String,
    blog: Object,
  },
  externalClasses: [
    'iconfont', 'icon-pinglun','icon-fenxiang'
  ],
  data: {
    loginShow: false,   //登录组件是否显示
    modalShow: false,   //底部弹出层是否显示
    content: '',
  },
  methods: {
    onComment(){
      //判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                //显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          }else{
            this.setData({
              loginShow: true,
            })
          }
        }
      })
    },
    onLoginsuccess(){
      //授权框消失，评论框显示
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true,
        })
      })
    },
    onLoginfail(event){
      userInfo=event.detail
      wx.showModal({
        title:'授权用户才能进行评价',
        content:''
      })
    },
    onSend(event){
      //插入云数据库
      let formId = event.detail.formId
      let content = event.detail.value.content
      if(content.trim()==''){
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        msak: true,
      })
      db.collection('blog-comment').add({
        data:{
          content,
          createTime: db.serverDate(),
          blogId:this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res) => {
        //推送模板消息
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            content,
            formId,
            blogId: this.properties.blogId
          }
        }).then((res) => {
          //对于模板消息推送，开发工具无法测试，需要用真机测试
          console.log(res)
        })
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false,
          content: '',
        })

        //父元素刷新评论页面
        this.triggerEvent('refreshCommentList')
      })
      
    },
  },
  onShareAppMessage: function(event){
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      //imageUrl: ''
    }
  }
})
