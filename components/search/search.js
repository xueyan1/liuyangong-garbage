import Http from '../../utils/request.js'
import {
  queryGarbagUrl
} from '../../utils/urls.js'
Component({
  externalClasses: ['input-class', 'icon-class'],

  /**
   * 组件的属性列表
   */
  properties: {
    inputHint: {
      type: String,
      value: '请输入垃圾名称'
    },
    inputIcon: {
      type: String,
      value: 'search.png'
    },
    inputType: {
      type: String,
      value: 'text'
    },
    isPassword: {
      type: Boolean,
      value: false
    },
    confirmType: {
      type: String,
      value: "done"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isClearShow: false,
    inputValue: '',
    resultList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputListener(e) {
      var value = e.detail.value;
      var cursor = e.detail.cursor;
      if (value === null || value === undefined || value.length === 0) {
        this.setData({
          isClearShow: false
        });
      } else {
        this.setData({
          isClearShow: true
        });
      }
      var detail = {
        value: value,
        cursor: cursor
      };
      this.triggerEvent('inputListener', detail);
    },

    inputConfirm(e) {
      let value = e.detail.value;
      let detail = {
        value: value
      }
      this.triggerEvent('inputConfirm', detail);
      this.isChinese(value, this.getResultList(value))
    },

    clearTap() {
      this.setData({
        isClearShow: false,
        inputValue: '',
        resultList: []
      });
    },
    getResultList(key){
      let that = this
      Http.get({
        url: queryGarbagUrl,
        params: {
          name: key
        }
      }).then((res => {
        console.log(res)
        if (res.data) {
          that.setData({
            resultList: res.data
          })
        }
      }))
    },
    // 跳转到详情
    bindNavigate(e) {
      const {
        key
      } = e.currentTarget.dataset
      this.isChinese(key, this.navigateToDetail(key))
    },
    navigateToDetail(key){
      this.clearTap()
      wx.navigateTo({
        url: `/pages/detail/detail?key=${key}`,
      })
    },
    //判断是否是中文
    isChinese(key, func) {
      var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
      let isChinese = reg.test(key)
      if (isChinese) {
        func
      } else {
        wx.showModal({
          content: '请输入中文',
          showCancel: false
        })
      }
    }
  }
})