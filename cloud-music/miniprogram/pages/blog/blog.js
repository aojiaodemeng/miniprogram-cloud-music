let keyword = ''   //搜索关键字
Page({
  data: {
    //控制底部弹出层是否显示
    modalShow: false,
    blogList: [],
  },
  //发布功能
  onPublish(){
    //判断用户是否授权
    wx.getSetting({
      success:(res)=>{
        if (res.authSetting['scope.userInfo']) {   //res.authSetting['scope.userInfo'返回为true说明授权过
          wx.getUserInfo({                        //授权过就要获取用户的头像、名称等用户信息
            success:(res) => {
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {   //没有授权过，弹出底部弹出层
          this.setData({
            modalShow: true,
          })
        }
      }
    })
  },
  onLoginSuccess(event){
    const detail = event.detail
    wx.navigateTo({
      url:`../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail(){
    wx.showModal({
      title:'授权用户才能发布博客',
      content: '',
    })
  },
  onLoad: function (options) {
    this._loadBlogList()

    //小程序端调用云数据库
    // const db = wx.cloud.database()
    // db.collection('blog').orderBy('createTime', 'desc').get()
    //   .then((res) => {
    //     console.log(res)
    //     const data = res.data
    //     for(let i=0,len=data.length;i<len;i++){
    //       data[i].createTime = data[i].createTime.toString()
    //     }
    //     this.setData({
    //       blogList: data
    //     })
    //   })

  },
  //加载博客列表
  _loadBlogList(start = 0){
    wx.showLoading({
      title:'拼命加载中'
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        count: 10,
        $url: 'list',
      }
    }).then((res)=>{
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
    })
  },
  goComment(event){
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId='+event.target.dataset.blogid,
    })
  },
  onSearch(event){
    this.setData({
      blogList: []
    })
    keyword = event.detail.keyword
    this._loadBlogList(0)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

})