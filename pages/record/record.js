var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
import {
  queryGarbagUrl
} from '../../utils/urls.js'
import Http from '../../utils/request.js'
Page({

  data: {
    currentText: '', // 语音输入的内容
    translateText: '', // 翻译的内容
    typeName: '',
    isRecording: false // 是否在录音
  },

  onLoad(options) {
    this.initRecord()
  },

  onShareAppMessage() {

  },
  initRecord() {
    manager.onRecognize = (res) => {

      console.log("onRecognize",res)
      let text = res.result
      this.setData({
        currentText: text,
      })
    }
    manager.onStop = (res) => {
      let text = res.result   
      if (text == '') return 
      this.setData({
        currentText: text,
      })   
      this.translateTextAction()  
    }
  },
  streamRecord() {
    manager.start({
      lang: 'zh_CN',
    })
    this.setData({
      isRecording: true
    })
  },
  endStreamRecord() {
    manager.stop()
    this.setData({
      isRecording: false
    })
  },
  translateTextAction() {
    this.getData(this.data.currentText)
    this.textToSpeech()
    this.translate()
  },
  // 点击跳转详情
  navigateToDetail() {
    const {
      currentText
    } = this.data
      let name = currentText.slice(0, -1)
    console.log(name)
    if(name){
      wx.navigateTo({
        url: `/pages/detail/detail?key=${name}`,
      })
    }
  },
  // 根据文字获取数据
  getData(key) {
    var that = this
    let name = key.slice(0, -1)
    let history = wx.getStorageSync('history')
    if (!history) {
      history = []
    }
    history.push(name)
    wx.setStorageSync("history", history)

    Http.get({
      url: queryGarbagUrl,
      params: {
        name
      }
    }).then((res => {
      console.log(res)
      if (res.data) {
        const index = res.data.findIndex((item) =>{
            return item.name === name
        })
        console.log(index)
        let typeName = ''
        let type = res.data[index].type
        wx.hideLoading()
        switch (type) {
          case 1:
            typeName = "是可回收垃圾!"
            break
          case 2:
            typeName = "是有害垃圾!"
            break
          case 4:
            typeName = "是湿垃圾!"
            break
          case 8:
            typeName = "是干垃圾!"
            break
          case 16:
            typeName = "是大件垃圾!"
            break
        }
        that.setData({
          typeName
        })
      }else{
        wx.showToast({
          title: '识别失败，请重试',
        })
      }
    }))
  },

  textToSpeech() {
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: this.data.currentText,
      success(res) {
        console.log("succ tts", res.filename)
        wx.playBackgroundAudio({
          dataUrl: res.filename,
          title: '',
        })
      },
      fail(res) {
        console.log("fail tts", res)
      }
    })
  },
  //翻译
  translate() {
    let lfrom = 'zh_CN'
    let lto = 'en_US'
    plugin.translate({
      lfrom: lfrom,
      lto: lto,
      content: this.data.currentText,
      tts: false,
      success: (resTrans) => {
        let text = resTrans.result
        this.setData({
          translateText: text,
        })
      },
    })
  }
})