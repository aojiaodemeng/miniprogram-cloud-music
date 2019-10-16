const app = getApp()
Page({
  data: {
    musiclist:[]
  },
  onLoad: function (options) {
    const playHistory = wx.getStorageSync(app.globalData.openid)
    if(playHistory.length==0){
      wx.showModal({
        title: '播放历史为空',
        content: '',
      })
    }else{
      //storage里面存储的muscilist替换成播放历史
      wx.setStorage({
        key:'musiclist',
        data:playHistory
      })
      this.setData({
        musiclist:playHistory
      })
    }
  },
})