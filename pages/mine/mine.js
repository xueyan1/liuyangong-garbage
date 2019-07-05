Page({
  data: {
    historyList: []
  },

  onLoad(options) {
    let history = wx.getStorageSync("history")
    this.setData({
      historyList: history
    })
  }
})