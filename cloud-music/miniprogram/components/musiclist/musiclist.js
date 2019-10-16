const app = getApp()
Component({
  properties: {
    musiclist: Array
  },
  data: {
    playingId: -1
  },
  pageLifetimes: {
    show(){
      this.setData({
        playingId: parseInt(app.getPlayMusicId())
      })
    }
  },
  methods: {
    onSelect(event){
      const ds = event.currentTarget.dataset
      const musicid = ds.musicid
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicid}&index=${ds.index}`,

      })
    }
  }
})
