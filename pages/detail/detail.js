import { queryGarbagUrl} from '../../utils/urls.js'
import Http from '../../utils/request.js'
const contentList = [{
  title: "可回收物",
  image: './image/recyclable.png',
  definition: "适宜回收利用和资源化 利用的，如：玻、金、 塑、纸、衣",
  include: "酱油瓶、玻璃杯、平板玻璃、易拉罐、饮料瓶、洗发水瓶、塑料玩具、书本、报纸、广告单、纸板箱、衣服、床上用品等",
  demandList: ["轻投轻放", "清洁干燥，避免污染", "废纸尽量平整", "立体包装物请清空内容物，清洁后压扁投放", "有尖锐边角的，应包裹后投放"],
  color: "rgb(0, 0, 102)"
},
  {
    title: "有害垃圾",
    image: './image/hazardous.png',
    definition: "对人体健康或者自然环 境造成直接或潜在危害 的废弃物",
    include: "废电池、油漆桶、荧光灯管、废药品及其包装物等",
    demandList: ["投放时请注意轻放", "易破损的请连带包装或包裹后轻放", "如易挥发，请密封后投放"],
    color: "rgb(229, 52, 34)"
  },
  {
    title: "湿垃圾",
    image: './image/household.png',
    definition: "日常生活垃圾产生的容 易腐烂的生物质废弃物",
    include: "剩菜剩饭、瓜皮果核、花卉绿植、过期食品等",
    demandList: ["纯流质的食物垃圾，如牛奶等，应直接倒进下水口", "有包装物的湿垃圾应将包装物去除", "后分类投放，包装物请投放到对应的可回收物或干垃圾容器"],
    color: "rgb(100, 64, 50)"
  },
{
  title: "干垃圾",
  image: './image/residual.png',
  definition: "除有害垃圾、可回收 物、湿垃圾以外的其他 生活废弃物",
  include: "餐盒、餐巾纸、湿纸巾、卫生间用纸、塑料袋、 食品包装袋、污染严重的纸、烟蒂、纸尿裤、 一次性杯子、大骨头、贝壳、花盆、陶瓷等",
  demandList: ["尽量沥干水分", "难以辨识类别的生活垃圾投入干垃圾容器内"],
  color: "rgb(44, 43, 41)"
}
]

Page({
  data: {
    contentList: contentList,
    result: [],
    isLoading:true,
    swiperCurrent:0
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
    }else {
      let result = wx.getStorageSync('garlist')
      if (JSON.parse(result).data) {
        this.setSwiperCurrent(JSON.parse(result).data[0].type)
        this.setData({
          result: JSON.parse(result).data,
          isLoading:false
        })
      }
    }
  },
  getDetail(key) {
    var that = this
    wx.showLoading({
      title: '识别中',
    })
    Http.get({
      url: queryGarbagUrl,
      params: {
        name: decodeURIComponent(key) 
      }
    }).then((res => {
      console.log(res)
      if (res.data) {
        that.setSwiperCurrent(res.data[0].type)
        that.setData({
          result: res.data,
          isLoading:false
        })
      }else {
        wx.showToast({
          title: '识别失败，请重试',
        })
      }
    })
    )
  },
  //选择每一个item
  chooseType(e){
    const { type } = e.currentTarget.dataset
    this.setSwiperCurrent(type)
  },
  // 设置滑块的位置
  setSwiperCurrent(type){
    let index = 0
    switch (type) {
      case 2:
        index = 1
      break
      case 4:
        index = 2
      break
      case 8:
        index = 3
        break
    }
    this.setData({
      swiperCurrent:index
    })
  }
})