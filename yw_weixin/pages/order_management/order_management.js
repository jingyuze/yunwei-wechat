// pages/personal/personal.js
const app = getApp()
var user, ReserveID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xixi: true,
    xiha: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user = app.globalData.userid
    var that = this;
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/currentorder.php?userid=' + user,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {

        var query_clone = JSON.parse(JSON.stringify(res.data));
        
        
        if (query_clone.Result == '1') {

          if (query_clone.Data.length > 0) {
          
            that.setData({
              result: query_clone.Data,
            })
          } else {
            wx.showToast({
              title: '没有订单数据',
              icon: 'loading',
              duration: 1000
            })
            that.setData({
              xixi: false,
              xiha: true,
            })
          }
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
xiangqing:function(event){
  var ids = event.currentTarget.dataset.id;
  var that = this;
  wx.request({
    url: 'https://www.yunweixinxi.com/android_parking/currentorder.php?userid=' + user,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    //请求后台数据成功 
    success: function (res) {

      var query_clone = JSON.parse(JSON.stringify(res.data));


      if (query_clone.Result == '1') {

        if (query_clone.Data.length > 0) {
          ReserveID = query_clone.Data[ids].ReserveID
          console.log(ReserveID);
          wx.navigateTo({
            url: '../order_details/order_details?tiaozhuan=' + ReserveID,
          })
        } else {
          wx.showToast({
            title: '没有订单数据',
            icon: 'loading',
            duration: 1000
          })
        
        }
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