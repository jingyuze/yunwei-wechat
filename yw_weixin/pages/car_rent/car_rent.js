// pages/car_rent/car_rent.js
const app = getApp()
var url = app.globalData.url
var AccessToken, RentID, ParkingID, ButtonDesc ,RentLotURL, screenwidth, screenheight,alldata; //本地取存储的sessionID
const plugin = requirePlugin("WechatSI")
var userid=''
const manager = plugin.getRecordRecognitionManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LotCount:false,
    LotNumber:false,
    LotState:false
  },
  tiaozhuan: () =>{
    wx.navigateTo({
      url: '../rent/rent'
    })
  },
  photo: (event) => {
    console.log(event.currentTarget.dataset.url)
    RentLotURL = alldata[event.currentTarget.dataset.url].LotMap
    ParkingID = alldata[event.currentTarget.dataset.url].ParkingID
    // userid = alldata[event.currentTarget.dataset.url].userid
    RentID = alldata[event.currentTarget.dataset.url].RentID
    console.log("取到的RentLotURL" + RentLotURL)
    console.log("取到的RentID" + RentID)
    console.log("取到的parkingid" + ParkingID)
    console.log("取到的userid" + userid)
    console.log("取到的图片高度" + screenheight)
    console.log("取到的图片宽度" + screenwidth)
    RentLotURL = RentLotURL + '?screenwidth=' + screenwidth + '&screenheight=' + screenheight + '&devicetype=3&parkingid=' + ParkingID + '&userid=' + userid + '&accesstoken=' + AccessToken + '&rentid=' + RentID+'&floor=1#wechat_redirect'
    console.log(RentLotURL)
    wx.navigateTo({
      url: '../rent_webview/rent_webview?RentLotURL=' + encodeURIComponent(RentLotURL),
    })
  
  },
  fixnews:function(){
    wx.makePhoneCall({
      phoneNumber: '4008321696' //仅为示例，并非真实的电话号码
    })
  },
  renewal:function(event){
    console.log(event.currentTarget.dataset.alphaBeta)
    RentID = alldata[event.currentTarget.dataset.alphaBeta].RentID
    console.log(RentID)
    wx.navigateTo({
      url: '../renewal/renewal?iRentID=' + RentID,
    })
  },
  list: function (event) {
    console.log(event.currentTarget.dataset.alphaBeta)
    RentID = alldata[event.currentTarget.dataset.alphaBeta].RentID
    console.log(RentID)
    wx.navigateTo({
      url: '../rent_list/rent_list?rentid=' + RentID,
    })
  },
  fault:(event)=>{
    console.log()
    console.log(event.currentTarget.dataset.alphaBe)
    ButtonDesc = alldata[event.currentTarget.dataset.alphaBe].ButtonDesc
    wx.showModal({
      content: ButtonDesc,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
    
        }
      }
    })
  },
  parkinfo:(res)=>{
    console.log(res.currentTarget.dataset.a)
    ParkList = alldata[res.currentTarget.dataset.a].ParkList
    var model = JSON.stringify(ParkList);
    console.log(model)
    wx.navigateTo({
      url: '../parkinfo/parkinfo?model=' + model,
    })
  },

  openlock:function(event){
    console.log(event.currentTarget.dataset.b)
    RentID = alldata[event.currentTarget.dataset.b].RentID
    console.log(RentID)
    var that = this
    that.reset
    wx.request({
      url: url + '/public/index.php/wxinterfeace/open_lock/rent_fixed_open_lock', //接口地
      method: "POST",
      data: {
        "rentid": RentID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        if (query_clone.Result == '1') {
          
          wx.showModal({
            title: '云位订吧',
            showCancel:false,
            content: "正在为您解锁，网络原因，可能有延时，请稍等！车位锁打开后，请及时入位",
            success(res) {
              if (res.confirm) {
                that.onShow()
              }
            }
          })
          plugin.textToSpeech({
            lang: "zh_CN",
            tts: true,
            content: "正在为您解锁，网络原因，可能有延时，请稍等！车位锁打开后，请及时入位",
            success: function (res) {
              console.log("succ tts", res.filename)
              const innerAudioContext = wx.createInnerAudioContext()
              innerAudioContext.autoplay = true
              innerAudioContext.src = res.filename
              innerAudioContext.onPlay(() => {
                console.log('开始播放')
              })
              innerAudioContext.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
              })
            },
            fail: function (res) {
              console.log("fail tts", res)
            }
          })
          
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
  reset:function(){
    this.onShow()
    console.log("我重载了页面")
    const that = this
    wx.request({
      url: url + '/public/index.php/wxinterfeace/rent/rent_lot', //接口地
      method: "POST",
      data: {
        "accesstoken": AccessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        console.log(query_clone.Data)
        alldata = query_clone.Data
        if (query_clone.Result == '1') {
          that.setData({
            return_data: query_clone.Data,
          })
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
  onLoad: function (options) {
    
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log("我被调用了")
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
    console.log(AccessToken)
    const that = this
    wx.request({
      url: url + '/public/index.php/wxinterfeace/rent/rent_lot', //接口地
      method: "POST",
      data: {
        "accesstoken": AccessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        console.log(query_clone.Data)
        alldata = query_clone.Data
        if (query_clone.Result == '1') {
          that.setData({
            return_data: query_clone.Data,
          })
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
    //获取屏幕的宽高
    // 获取系统信息
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