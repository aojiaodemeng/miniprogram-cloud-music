import formatTime from '../../utils/formatTime.js'
Component({
  properties: {
    blog: Object
  },
  observers: {
    ['blog.createTime'](val){
      if(val){
        this.setData({
          _createTime: formatTime(new Date(val))
        })
        
      }
    }
  },
  data: {
    _creatTime: ''
  },
  methods: {
    onPreviewImage(event){
      const ds = event.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc,
      })
    },
  }
})
