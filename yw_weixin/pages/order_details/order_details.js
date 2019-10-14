// pages/order_details/order_details.js
const app = getApp()
var ReserveID,user
var AccessToken;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ReserveID = options.tiaozhuan
    console.log("传参进来的ReserveID" + ReserveID)
    user = app.globalData.userid
    console.log("取到全局的userid" + user)
    var that = this;
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/currentorderdetails.php?userid=' + user + '&orderid=' + ReserveID,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {

        var query_clone = JSON.parse(JSON.stringify(res.data));
       
        
        if (query_clone.Result == '1') {

         
          
            that.setData({
              result: query_clone.Data,
            })
          
        } else if (query_clone.Result == '0') {
          wx.showToast({
            title: '错误',
            icon: 'success',
            duration: 1000
          })
        }


      }
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
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    AccessToken = accessToken;
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