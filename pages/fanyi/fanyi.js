var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
import {
  queryGarbagUrl
} from '../../utils/urls.js'
import Http from '../../utils/request.js'
let timeIndex= ''
Page({

  data: {
    currentText: '开始录音吧～单次最长可录一分钟哦', // 语音输入的内容
    allText: '',
    languages: ['普通话', '英语', '粤语', '川普'],
    pickerIndex: -1,
    time: 0
  },

  onLoad(options) {
    this.initRecord()
  },

  initRecord() {
    // manager.onRecognize = (res) => {
    //   console.log("onRecognize", res)
    //   let text = res.result
    //   this.setData({
    //     currentText: text,
    //   })
    // }
    // manager.onStop = (res) => {
    //   console.log("onStop", res)
    //   let text = res.result
    //   if (text == '') return
    //   this.setData({
    //     currentText: text,
    //   })
    // }
    manager.onStart = (res) => {
      console.log("onStart", res)
    }
    manager.onError = (res) => {
      console.log("onError", res)
      wx.showModal({
        title: '错误码' + res.retcode,
        content: res.msg
      })
    }
  },
  streamRecord(e) {
    manager.start({
      lang: 'zh_CN',
    })
    timeIndex = setInterval(() => {
      this.setData({
        time: this.data.time + 1,
      })
    }, 1000)
    this.setData({
      isRecording: true
    })
  },
  endStreamRecord() {
    clearInterval(timeIndex)
 
    this.data.allText = this.data.allText + this.data.currentText
    this.setData({
      isRecording: false,
      allText: this.data.allText,
      time: 0
    })
  },
  clear() {
    clearInterval(timeIndex)
    this.setData({
      currentText: '',
      allText: '',
      time: 0
    })
  },
  onShareAppMessage() {
    return {
      title: '语音转文字',
      path: '/pages/fanyi/fanyi',
      imageUrl: '/image/xue-.png'
    }
  },
  pickerchange(e) {
    const {
      value
    } = e.detail
    console.log(value)
    this.setData({
      pickerIndex: value
    })
    if (value === 0) {
      manager.start({
        lang: 'zh_CN',
      })
    }
    if (value === 1) {
      manager.start({
        lang: 'en_US',
      })
    }
    if (value === 2) {
      manager.start({
        lang: 'zh_HK',
      })
    }
    if (value === 0) {
      manager.start({
        lang: 'sichuanhua',
      })
    }
  }
})