// pages/occupied/occupied.js
var parkingID, orderID, devicenumber, OrderType = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parkingid: "0",
    orderid: "0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    parkingID = options.ParkingID;
    console.log(parkingID)
    orderID = options.orderID;
  },
  back_index:function(){
    wx.reLaunch({
      url: '../map/map'
    })
  },
  //扫码开锁
  kaisuo: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var url = res.result;
        let qrId = decodeURIComponent(res.path)
        console.log(qrId)
        console.log(typeof (qrId))
        devicenumber = qrId.substr(-9, 8)
        OrderType = qrId.substr(-1, 1)

        console.log("OrderType=" + OrderType)
        console.log("devicenumber=" + devicenumber)
        if (devicenumber != '' && OrderType != '') {
          wx.redirectTo({
            url: '../chepai/chepai?DeviceNumber=' + devicenumber + '&OrderType=' + OrderType
          })
        } else {
          wx.showToast({
            title: '扫码失败',
            icon: 'none'
          })
        }
      },
      fail: (res) => {
        wx.showModal({
          title: '提示',
          content: JSON.stringify(res),
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  scan:function(event){

  },
  list: function (event){
    wx.navigateTo({
      url: '../vacancy_list/vacancy_list?ParkingID=' + parkingID,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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