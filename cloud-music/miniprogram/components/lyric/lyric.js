// components/lyric/lyric.js
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },
  // 监听歌词
  observers: {
    lyric(lrc) {
      if (lrc == '暂无歌词') {
        //无歌词
        this.setData({
          lrcList: [
            {
              lrc,
              time: 0,
            }
          ],
          nowLyricIndex: -1
        })
      } else {
        //有歌词——解析歌词
        this._parseLyric(lrc)
      }

    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0,//表示选中的歌词的索引,
    scrollTop: 0, //滚动条滚动的高度
  },
  lifetimes: {
    ready() {
      //任何的手机，规定在小程序当中宽度都是750rpx,getSystemInfo是获取手机设备信息
      wx.getSystemInfo({
        success(res) {
          // res.screenWidth是1rpx的大小，64是一行歌词的高度
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime) {
      let lrcList = this.data.lrcList
      if (lrcList.length == 0) {
        return
      }
      //情况处理：当lrcList里面所展示的时间已经小于当前播放的时间，但是还有歌词内容
      if (currentTime > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {   //表示还不是最后一句
          this.setData({
            nowLyricIndex: -1,  //没有哪一句歌词是高亮的
            scrollTop: lrcList.length * lyricHeight  //直接滚动到最后一句
          })
        }
      }
      for (let i = 0, len = lrcList.length; i < len; i++) {
        if (currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    _parseLyric(sLyric) {
      let line = sLyric.split('\n')
      let _lryList = []
      line.forEach((elem) => {
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:.(\d{2,3}))?/)
          //把时间转换为秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lryList.push({
            lrc,
            time: time2Seconds,
          })

        }
      })
      this.setData({
        lrcList: _lryList
      })
    }
  }
})