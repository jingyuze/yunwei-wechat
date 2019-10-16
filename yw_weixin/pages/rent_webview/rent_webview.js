// pages/rent_webview/rent_webview.js
const app = getApp()
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
var url = app.globalData.url
var weburl = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weburl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  postinfo: (e)=>{
    console.log("触发成功")
    wx.showModal({
      title: '云位订吧',
      showCancel: false,
      content: "正在为您解锁，网络原因，可能有延时，请稍等！车位锁打开后，请及时入位",
      success(res) {
        if (res.confirm) {
          that.onShow()
        }
      }
    })
    console.log(e);
    if (e.detail ){
      plugin.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: "正在为您解锁，网络原因，可能有延时，请稍等！车位锁打开后，请及时入位",
        success: function (res) {
          console.log("succ tts", res.filename)
          const innerAudioContext = wx.createInnerAudioContext()
          innerAudioContext.autoplay = true
          innerAudioContext.src = res.filename
          innerAudioContext.onPlay(() => {
            console.log('开始播放')
          })
          innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
          })
        },
        fail: function (res) {
          console.log("fail tts", res)
        }
      })
    }

  },
  onLoad: function (options) {
    console.log(options)
    weburl = decodeURIComponent(options.RentLotURL)
    console.log(weburl)
     this.setData({
       weburl: weburl
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})