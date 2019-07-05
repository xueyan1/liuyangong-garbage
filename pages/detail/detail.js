const classifyUrl = "http://www.atoolbox.net/api/GetRefuseClassification.php?key="

Page({
  data: {
    result: []
  },

  onLoad(options) {
    const {
      key
    } = options
    if (key) {
      let history =  wx.getStorageSync('history')
      history.push(key)
      wx.setStorageSync("history", history)
      wx.setNavigationBarTitle({title: key})

      this.getDetail(encodeURIComponent(key))
    }
  },
  getDetail(key) {
    var that = this
    wx.showLoading({
      title: '识别中',
    })
    wx.request({
      url: `${classifyUrl}${key}`,
      success(res) {
        wx.hideLoading()
        that.setData({
          // result: res.data
             result: []
        })
      },
      fail() {
        wx.showToast({
          title: '识别失败，请重试',
        })
      }
    })
  },
})