// pages/list_detail/list_detail.js
const app = getApp()
var url = app.globalData.url
var lotid = ''
var ParkingID, devicenumber, mydata, UserID='';
var AccessToken; //本地取存储的sessionID
Page({
  /**
   * 页面的初始数据
   */
  data: {
    boolean: 0,
    xixi: true,
    button:'',
    qie: true
  },
  request:function(event){
    var that = this
    console.log(event.currentTarget.dataset.alphaBeta)
    ParkingID = mydata[event.currentTarget.dataset.alphaBeta].ParkingID
    console.log(ParkingID)
      wx.navigateTo({
        url: '../rent_type/rent_type?ParkingID=' + ParkingID,
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    UserID = app.globalData.userid
    console.log(UserID)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/park_info/park_rent_list', //接口地
      method: "POST",
      data: {
        'userid': UserID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        console.log(query_clone.Data)
        if (query_clone.Result == '1') {
          if (query_clone.Data.length>0){
            mydata = query_clone.Data
            that.setData({
              button: query_clone.Data,
            })
          }else{
            xixi:false
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

    //渲染加载

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