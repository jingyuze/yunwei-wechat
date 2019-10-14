// pages/rent_type/rent_type.js
const app = getApp()
var url = app.globalData.url
var lotid = ''
var ParkingID, devicenumber, mydata, listt, RentLotURL, userid, screenwidth, screenheight, RentLo = '';
var AccessToken;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    left:true,
    right:false,
    fixed:'',
    nofixed:'',
    RentMoney:'',
    explain:'',
    ParkingName:''
  },
  submit:function(){
    if(this.data.left){
      for (var i = 0; i < listt.length; i++) {
        if (listt[i].RentState == '1') {
          console.log("屏幕宽度" + screenwidth)
          RentLotURL = listt[i].RentLotURL
          RentLo = RentLotURL + '?screenwidth=' + screenwidth + '&screenheight=' + screenheight + '&devicetype=3&parkingid=' + ParkingID + '&userid=' + userid +'&rentid=0&floor=1#wechat_redirect'
        }
      }
      console.log(RentLo)
      wx.navigateTo({
        url: '../rent_webview/rent_webview?RentLotURL=' + encodeURIComponent(RentLo),
        })
  console.log("left")
    } else if (this.data.right){
      for (var i = 0; i < listt.length; i++) {
        if (listt[i].RentState == '2') {
          RentLotURL = listt[i].RentLotURL
          console.log(RentLotURL)
        }
      }
      wx.navigateTo({
        url: '../fixed_car/fixed_car?ParkingID=' + ParkingID,
      })
    }
  },
  left:function(){
    console.log(mydata)
     var that = this
    for (var i = 0; i < listt.length; i++) {
      if (listt[i].RentState == '1') {
        that.setData({
          RentMoney: mydata.RentList[i].RentMoney,
          explain: mydata.RentList[i].RentBriefRule,
          left: true,
          right: false,
        })
      }
    }
  },
  right: function () {
    var that = this
    for (var i = 0; i < listt.length; i++) {
      if (listt[i].RentState == '2') {
        that.setData({
          RentMoney: mydata.RentList[i].RentMoney,
          explain: mydata.RentList[i].RentBriefRule,
          left: false,
          right: true,
        })
      }
    }
  },
  rent_deal:function(){
    wx.navigateTo({
      url: '../rent_deal/rent_deal',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ParkingID = options.ParkingID
    console.log(ParkingID)
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
    console.log(AccessToken)
    var that = this
    wx.request({
      url: url + '/public/index.php/wxinterfeace/rent/rent_park_details', //接口地
      method: "POST",
      data:{
        "parkingid": ParkingID,
        "accesstoken": AccessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        if (query_clone.Result == '1') {
          userid = query_clone.Data.UserID
          listt = query_clone.Data.RentList
          console.log(listt)
          if (query_clone.Data.RentList.length > 0) {
            mydata = query_clone.Data
            console.log(mydata)
            that.setData({
              ParkingName: query_clone.Data.ParkingName,
            })
          } else {
            xixi: false
          }

        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
          })
        }
        if (query_clone.Data.RentType == '3'){
          console.log("进入3了")
          console.log(listt.length)
          for (var i = 0; i < listt.length; i++) {
            if (listt[i].RentState == '1') {
              console.log(mydata.RentList[i].RentMoney)
              that.setData({
                RentMoney: mydata.RentList[i].RentMoney,
                explain: mydata.RentList[i].RentBriefRule,
                fixed: 'left',
                nofixed: 'right',
              })
            }
          }
        
        } else if (query_clone.Data.RentType == '1'){
          console.log("进入1了")
          console.log(listt.length)
          for (var i = 0;i<listt.length;i++) {
            if (listt[i].RentState =='1'){
              that.setData({
                RentMoney: mydata.RentList[i].RentMoney,
                explain: mydata.RentList[i].RentBriefRule,
                fixed: 'left',
                nofixed: 'none'
              })
            }
          }
        } else if (query_clone.Data.RentType == '2'){
          console.log("进入2了")
          console.log(listt.length)
          for (var i = 0; i < listt.length; i++) {
            if (listt[i].RentState == '2') {
              that.setData({
                RentMoney: mydata.RentList[i].RentMoney,
                explain: mydata.RentList[i].RentBriefRule,
                left: false,
                right: true,
                nofixed: 'right',
                fixed: 'none'
              })
            }
          }
        
        }
      

      },
      fail: function (res) {
        wx.showToast({
          title: '没有网络',
          image: '../../images/public/ic_net_error.png',
        })
      },
    })

    //获取屏幕的宽高
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口高度
        let clientWidth = res.windowWidth;
        // 算出比例
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        screenheight = clientHeight * ratio;
        screenwidth = clientWidth * ratio;
        // 设置高度
        console.log(screenheight)
        console.log(screenwidth)
      }
    });

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