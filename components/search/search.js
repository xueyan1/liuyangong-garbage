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
    inputValue: ''
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
      var value = e.detail.value;
      var detail = {
        value: value
      }
      this.triggerEvent('inputConfirm', detail);
      this.navigate(value)
    },

    clearTap() {
      this.setData({
        isClearShow: false,
        inputValue: ''
      });
    },
    navigate(key){
      var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
      let isChinese = reg.test(key)
      if (isChinese) {
        this.clearTap()
        wx.navigateTo({
          url: `/pages/detail/detail?key=${key}`,
        })
      } else {
        wx.showModal({
          content: '请输入中文',
          showCancel: false
        })
      }
    }
  }
})