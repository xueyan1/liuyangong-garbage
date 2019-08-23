/**
 * 显示消息提示框
 * @param {String} title 提示内容
 * @param {Object} param 可选
 */
// 阻止Toast展示期间被request的loading hide
// 导致toast一闪而过

let isShowToast = false

function showToast(title, param) {
  if (!showToast.isEnable) return

  const options = {
    title,
    icon: 'none',
    mask: true,
    duration: 1500,
    ...param
  }

  wx.showToast(options)

  isShowToast = true
  setTimeout(() => (isShowToast = false), options.duration)
}

function hideToast() {
  isShowToast = false
  wx.hideToast()
}

showToast.isEnable = true

/**
 * Loading 加载
 */
class Loading {
  static show(title = '加载中', param) {
    isShowToast = false
    wx.showLoading({
      title,
      ...param
    })
  }

  static hide() {
    if (isShowToast) return
    wx.hideLoading()
  }
}

/**
 * 显示模态弹窗
 * @param {Object} param
 * title: 标题
 * content: 提示内容
 * param: 剩余参数
 */
let isShow = false
function showModal(title = '提示', content, { success, fail, complete, ...param } = {}) {
  return new Promise((resolve, reject) => {
    if (!isShow) {
      isShow = true
      wx.showModal({
        title,
        content,
        success: res => {
          if (success) success(res)
          resolve(res)
        },
        fail: error => {
          if (fail) fail(error)
          reject(error)
        },
        complete: data => {
          if (complete) complete(data)
          isShow = false
        },
        ...param
      })
    }
  })
}

/**
 * 获取地理位置
 * @param {String} type
 */
function getLocation(type = 'gcj02') {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type,
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    })
  })
}

class Storage {
  /**
   * 异步存储
   * @param {String} key key
   * @param {Object/String} data 存储的内容
   * @param {Object} param 可选
   */
  static set(key, data, param) {
    wx.setStorage({
      key,
      data,
      ...param
    })
  }

  /**
   * 同步存储
   * @param {String} key key
   * @param {Object/String} data 存储的内容
   */
  static setSync(key, data) {
    wx.setStorageSync(key, data)
  }

  /**
   * 异步获取
   * @param {Object} param
   * key: key
   * success: 成功回调
   * param: 剩余参数
   */
  static get({ key, success, ...param }) {
    wx.getStorage({
      key,
      success: res => {
        success(res.data)
      },
      ...param
    })
  }

  /**
   * 同步获取
   * @param {String} key key
   */
  static getSync(key) {
    return wx.getStorageSync(key)
  }

  /**
   * 异步删除
   * @param {String} key key
   */
  static remove({ key, success, ...param }) {
    return wx.removeStorage({
      key,
      success(res) {
        success && success(res)
      },
      ...param
    })
  }

  /**
   * 同步删除
   * @param {String} key key
   */
  static removeSync(key) {
    return wx.removeStorageSync(key)
  }
}

export {
  showToast,
  hideToast,
  Loading,
  showModal,
  getLocation,
  Storage
}
