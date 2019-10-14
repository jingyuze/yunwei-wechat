// pages/list/list.js
const app = getApp()
var url = app.globalData.url
var AccessToken; 
Page({

  /**
   * 页面的初始数据
   */
  data: {


  },
  agreement:function(){
    wx.navigateTo({
      url: '../webview_agreement/agreement',
    })
  },
  feedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  fare: function () {
    wx.navigateTo({
      url: '../fare_payment/fare_payment',
    })
  },
  order: function () {
    wx.navigateTo({
      url: '../order_list/order_list'
    })
  },
  rent:function(){
    const that = this
    wx.request({
      url: url + '/public/index.php/wxinterfeace/user/check_rent', //接口地
      method: "POST",
      data: {
        'accesstoken': AccessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        app.globalData.userid = query_clone.Data.UserID
        console.log("userid="+app.globalData.userid)
        if (query_clone.Result == '1') {
          if (query_clone.Data.TurnType == '1'){
            console.log("跳转至已月租车位列表")
            wx.navigateTo({
              url: '../car_rent/car_rent'
            })
          } else if (query_clone.Data.TurnType == '2'){
            console.log("跳转至月租车场")
            wx.navigateTo({
              url: '../rent/rent'
            })
          }          
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
    })
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad :function(){
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
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