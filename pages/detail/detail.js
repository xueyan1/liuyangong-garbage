import { queryGarbagUrl} from '../../utils/urls.js'
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
      if (!history){
        history = []
      }
      history.push(key)
      wx.setStorageSync("history", history)
      wx.setNavigationBarTitle({title: key})
      this.getDetail(encodeURIComponent(key))
    }
    let result = wx.getStorageSync('garlist')
    if (JSON.parse(result).data) {
      this.setData({
        result: JSON.parse(result).data
      })
    }

  },
  getDetail(key) {
    var that = this
    wx.showLoading({
      title: '识别中',
    })
    
    wx.request({
      url: `${queryGarbagUrl}?name=${key}`,
      success(res) {
        let list = []
        let data={}
        wx.hideLoading()
        data = res.data.data
        list.push(data) 
        that.setData({
          result: list
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