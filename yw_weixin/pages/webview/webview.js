//index.js
//获取应用实例
const app = getApp();
var parkingID, AccessToken, WebURL, screenwidth, screenheight;

Page({
  data: {
    weburl: ""
  },
  //右上角分享功能

  onLoad: function (options) {
    var that = this;
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    AccessToken = accessToken;
    WebURL = decodeURIComponent(options.webUrl);
    
    console.log(WebURL)

console.log("onload")
  
  },
  //页面卸载时触发
  onShow(){
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.screenHeight;
        // 获取可使用窗口高度
        let clientWidth = res.screenWidth;
        console.log(res.pixelRatio)
        console.log(res.screenHeight)
        // 算出比例
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        screenheight = clientHeight;
        screenwidth = clientWidth;
        // 设置高度
        console.log(screenheight)
        console.log(screenwidth)
      }
    });
    console.log(AccessToken)
    var accessToken = wx.getStorageSync('AccessToken');
    AccessToken = accessToken;
    var that = this;
    that.setData({
      weburl: WebURL
    });
    //获取屏幕的宽高
    // 获取系统信息

  },
  onHide() {


  },
  onUnload() {
  
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '云位订吧',
      imageUrl: "/images/zhuanfa.jpg",
      path: '/pages/onLoad/onLoad',
      success: function (res) {
        // 转发成功

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }

  }
})
