// pages/list_detail/list_detail.js
const app = getApp()
var lotid = ''
var user
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    boolean: 0,
    xixi: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    lotid = options.tiaozhuan
    console.log("传递过来的lotid是"+lotid)
    user = app.globalData.userid
    console.log("获取全局userid" + user)

    //渲染加载
    var that = this;
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/managerinfo.php?userid=' + user + '&lotid=' + lotid,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {

        var query_clone = JSON.parse(JSON.stringify(res.data));
        console.log("返回的Result是" + query_clone.Result )
        if (query_clone.Result == '1') {
           
            that.setData({
              button: query_clone.Data,
              boolean:1
            })
            
        } else if (query_clone.Result == '0') {
        
          wx.showToast({
            title: '没有数据',
            icon: 'loading',
            duration: 2000
          })
          that.setData({
            xixi:false
          })

        } else if (query_clone.Result == '2'){
          that.setData({
            button: query_clone.Data,
            boolean:2
          })

        }
        // console.log(query_clone.Data.ReserveTime)

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