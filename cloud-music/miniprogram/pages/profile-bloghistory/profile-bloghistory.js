// pages/profile-bloghistory/profile-bloghistory.js
const MAX_LIMIT = 10
const db = wx.cloud.database()
Page({
  data: {
    blogList: []
  },

  onLoad: function (options) {
    //云函数实现
    // this._getListByCloudFn()
    //使用小程序端实现
    this._getListByMiniprogram()
  },
  _getListByCloudFn(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data: {
        $url: 'getListByOpenid',
        start: this.data.blogList.length,
        count: MAX_LIMIT
      }
    }).then((res)=>{
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
    })
  },
  _getListByMiniprogram(){
    db.collection('blog').skip(this.data.blogList.length)
    .limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then((res)=>{
      let _bloglist = res.data
      for(let i=0,len=_bloglist.length;i<len;i++){
        _bloglist[i].createTime = _bloglist[i].createTime.toString()
      }
      this.setData({
        blogList: this.data.blogList.concat(_bloglist)
      })
    })
  },  
  onReachBottom: function () {
    //使用云函数
    // this._getListByCloudFn()
    //使用小程序端实现
    this._getListByMiniprogram()
  },
  goComment(event){
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,

    })
  },
  onShareAppMessage: function(event){
    const blog = event.target.dataset.blog
    return {
      title:blog.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blog._id}`
    }
  }
})