Page({
  data: {
    musiclist: [],
    listInfo: {}
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then((res)=>{
      const pl = res.result.playlist
      this.setData({
        musiclist: pl.tracks,
        listInfo: {
          coverImgUrl: pl.coverImgUrl,
          name: pl.name
        }
      })
      this._setMusiclist()
      wx.hideLoading()
    })
  },

  _setMusiclist(){
    //存储到本地
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
})