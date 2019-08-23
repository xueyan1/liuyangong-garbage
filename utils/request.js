
import { queryGarbagUrl } from './urls.js'
function getRefuseData(key){
  return new Promise((resolve, reject)=>{
    wx.request({
      url: `${queryGarbagUrl}?name=${key}`,
      success(res) {
        if (res.resultCode === 0 ){
          resolve(res.data.data)
        }
      },
      fail() {
        wx.showToast({
          title: '识别失败，请重试',
        })
        reject( new Error())
      }
    })
  })
}
module.exports= {
  getRefuseData
}