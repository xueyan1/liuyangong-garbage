import { queryByImgUrl } from '../../utils/urls.js'
Page({
  data: {

  },

  onLoad(options) {

  },

  onShow() {

  },


  onShareAppMessage() {
    
  },
  // 选择图片上传
  chooseImg() {
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传识别中'
        })
        wx.uploadFile({
          url: queryByImgUrl, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "content-type": "multipart/form-data"//记得设置
          },
          formData: {
            'user': 'test'
          },
          success(res) {
            wx.hideLoading()
            const data = res.data
            console.log("data",data)
            if(data){
              wx.setStorageSync("garlist", data)
              wx.navigateTo({
                url: '/pages/detail/detail',
              })
            }
          }
        })
      },
    })
  }
})