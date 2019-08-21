Page({
  data: {
    historyList: []
  },

  onLoad(options) {
    let history = wx.getStorageSync("history")
    if (history ) {
      history =  Array.from(new Set(history))
      this.setData({
        historyList: history.slice(0,12)
      })
    }
  },
  onShareAppMessage(){}
})