Page({
  data: {
    historyList: []
  },

  onShow() {
    let history = wx.getStorageSync("history")
    if (history) {
      history =  Array.from(new Set(history))
      this.setData({
        historyList: history.slice(0,12)
      })
    }
  },
  onShareAppMessage(){},
  // 长按删除每一条
  deleteItem(e){
    const { index } = e.currentTarget.dataset
    this.data.historyList.splice(index,1)
    this.setData({ historyList:this.data.historyList})
    wx.setStorageSync("history", this.data.historyList)
  },
  navigatorTodetail(e){
    const { index } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?key=${this.data.historyList[index]}`,
    }) 
  }
})