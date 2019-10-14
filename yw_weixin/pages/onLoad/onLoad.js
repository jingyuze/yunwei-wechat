//获取应用实例 
const app = getApp()
var url = app.globalData.url
Page({
  data: {
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
  },
  onLoad: function(option) {
    setTimeout(() => {
      var loginState = wx.getStorageSync('LoginState');
      var accessToken = wx.getStorageSync('AccessToken');
      console.log("onload_loginState:"+loginState);
      console.log("onload_AccessToken:" + accessToken);
      if (!loginState) {
        wx.redirectTo({
          url: '../authorization/authorization?OrderType=1',
        })
      }else{
        var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
        console.log("onload_AccessToken:" + accessToken);
        var that = this
        wx.request({
          url: url + '/public/index.php/wxinterfeace/login/login_log', //接口地
          method: "POST",
          data: {
            'accesstoken': accessToken,
            'devicetype': '3'
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var query_clone = res.data;
            if (query_clone.Result == '1') {
              console.log(res.data.Message)
            } else {
              wx.showToast({
                title: res.data.Message,
                icon: 'none',
              })
            }

          },
          fail: function (res) {
            wx.showToast({
              title: '没有网络',
              image: '../../images/public/ic_net_error.png',
            })
          },
          complete:function(){
            wx.redirectTo({
              url: '../map/map',
            })
          }
        })
      
      }
    }, 2500)
  },
  onShow: function() {

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