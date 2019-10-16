const MAX_LIMIT = 15
const db = wx.cloud.database()
Page({
  data: {
    swiperImgUrls:[
      // {
      //   url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      // },
      // {
      //   url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      // },
      // {
      //   url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      // }
    ],
    playlist: []
  },
  onLoad: function (options) {
    this._getPlaylist()
    this._getSwiper()
  },
  onPullDownRefresh: function () {
    this.setData({
      playlist:[]
    })
    this._getPlaylist()
    this._getSwiper()
  },
  _getPlaylist(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist'
      }
    }).then((res) => {
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  _getSwiper(){
    db.collection('swiper').get().then((res)=>{
      this.setData({
        swiperImgUrls: res.data
      })
    })
  },
}) 