import Http from '../../utils/request.js'
import { queryByImgUrl } from '../../utils/urls.js'
Page({
  data: {
    photoWidth: 0,
    photoHeight: 0,
    show:true, // 照相机显示
    showCanvas:false // 图片显示
  },
  onLoad() {

  },
  onShow(){
    this.setData({
      show:true,
      showCanvas:false
    })
  },
  drawImage(imagePath) {
    const cv = wx.createCanvasContext('canvas', this)
    const drawFunc = () => {
      cv.drawImage(imagePath, 0, 0, this.data.photoWidth, this.data.photoWidth, 0, 0, 300, 300)
      cv.draw()
    }
    if (this.data.photoWidth == 0) {
      wx.getImageInfo({
        src: imagePath,
        success: (res) => {
          this.setData({
            photoWidth: res.width,
            photoHeight: res.height
          }, () => {
            drawFunc()
          })
        }
      })
    } else {
      drawFunc()
    }
  },

  takeAndPredict: function () {

    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          show: false,
          showCanvas:true
        }, () => {
          this.drawImage(res.tempImagePath)
          console.log(res.tempImagePath)
        })
        wx.showLoading({
          title: '上传识别中'
        })
        wx.uploadFile({
          url: queryByImgUrl, //仅为示例，非真实的接口地址
          filePath: res.tempImagePath,
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
            console.log("data", data)
            if (data) {
              wx.setStorageSync("garlist", data) // 因为返回来的可能是多数据的，所以保存起来，不过不作为历史查询
              wx.navigateTo({
                url: `/pages/detail/detail`,
              })
            }
          }
        })
      }
    })
  }
})
