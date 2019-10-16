const MAX_WORDS_NUM = 140  //输入文字最大的个数
const MAX_IMG_NUM = 9   //最大上传图片数量
const db = wx.cloud.database()
let content = ''  //当前输入的文字内容
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,  //输入的文字个数
    footerBottom: 0,
    images: [],
    selectPhoto: true,   //添加图片元素是否显示
  },
  onInput(event){
    let wordsNum = event.detail.value.length
    if(wordsNum >= MAX_WORDS_NUM){
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },
  onFocus(event){
    //模拟器获取的键盘高度为0
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur(){
    this.setData({
      footerBottom: 0,
    })
  },
  onChooseImage(){
    //max表示当前还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length  
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        //选择了图片之后，还能选择几张
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  onDelImage(event){
    this.data.images.splice(event.target.dataset.index, 1)
    //splice方法，返回的是删除的图片，并且splice方法会改变原数组
    this.setData({
      images: this.data.images
    })
    if(this.data.images.length == MAX_IMG_NUM -1 ){
      this.setData({
        selectPhoto: true
      })
    }
  },
  //预览图片
  onPreviewImage(event){
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,
    })
  },
  send(){
    //1、将图片上传到云存储，并获取fileID 云文件ID
    if(content.trim() === ''){  
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true,
    })
    let promiseArr = []
    let fileIds = []
    for(let i=0,len=this.data.images.length; i<len; i++){
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        //文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => { reject() }
        })
      })
      promiseArr.push(p)
    }
    //存入到云数据库中，最好是将所有文件都上传完之后再存，所以需要用到promise
    //要存入内容、图片fileId、openid、昵称、头像、时间(在小程序端操作数据会自带openId)
    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data:{
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate(), //服务端的时间
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        wx.navigateBack()   //返回blog页面，并且刷新
        const pages = getCurrentPages()
        //取到上一个界面
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
  },
})