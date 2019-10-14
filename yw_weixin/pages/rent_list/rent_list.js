// pages/list_detail/list_detail.js
const app = getApp()
var url = app.globalData.url
var lotid = ''
var ParkingID, devicenumber, mydata, rentid, LotID, alldata= '';
var AccessToken; //本地取存储的sessionID
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    boolean: 0,
    xixi: true,
    button: '',
    qie: true
  },
  request: function (event) {
    var that = this
    console.log(event.currentTarget.dataset.alphaBeta)
    ParkingID = mydata[event.currentTarget.dataset.alphaBeta].ParkingID
    console.log(ParkingID)
    wx.navigateTo({
      url: '../rent_type/rent_type?ParkingID=' + ParkingID,
    })
  },
  openlock: (event)=>{
    console.log(alldata)
    console.log(event.currentTarget.dataset.alphaBeta)
    LotID = alldata[event.currentTarget.dataset.alphaBeta].LotID
    console.log(LotID)
    console.log(rentid)
    console.log(AccessToken)
    const that = this
    wx.request({
      url: url + '/public/index.php/wxinterfeace/open_lock/rent_unfixed_open_lock', //接口地
      method: "POST",
      data: {
        "rentid": rentid,
        "accesstoken": AccessToken,
        "lotid": LotID
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
            showCancel: false,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    rentid = options.rentid
    console.log(rentid)
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
    console.log(AccessToken)
    const that = this
    wx.request({
      url: url + '/public/index.php/wxinterfeace/lot_info/rent_available_lot_list', //接口地
      method: "POST",
      data: {
        "rentid": rentid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        if (query_clone.Result == '1') {
          if (query_clone.Data.length > 0) {
            alldata = query_clone.Data
            that.setData({
              button: query_clone.Data,
            })
          } else {
            that.setData({
              xixi:false,
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