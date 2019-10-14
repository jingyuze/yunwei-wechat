// pages/order_details_history/order_details_history.js
const app = getApp();
var url = app.globalData.url;
var AccessToken;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    return_data: [],
    ParkingID: 0,
    OrderID: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var parkingid = options.ParkingID;
    var orderid = options.OrderID;
    var accessToken = wx.getStorageSync('AccessToken');
    AccessToken = accessToken;
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/order_details_info',
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'parkingid': parkingid,
        'orderid': orderid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.data.Result == 1) {
          that.setData({
            return_data: res.data.Data.ListValue,
            ParkingID: options.ParkingID,
            OrderID: options.OrderID
          });
        } else if (res.data.Result == '2000') {
          wx.removeStorage({
            key: 'AccessToken',
            success(res) {
              console.log(res)
            }
          })
          wx.removeStorage({
            key: 'LoginState',
            success(res) {
              console.log(res)
            }
          })
          wx.redirectTo({
            url: '../authorization/authorization',
          })
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          image: '../../images/public/ic_net_error.png',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var accessToken = wx.getStorageSync('AccessToken');
    AccessToken = accessToken;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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