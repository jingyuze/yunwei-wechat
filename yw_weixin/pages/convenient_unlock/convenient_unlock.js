const app = getApp()
var url = app.globalData.url
var back_arry = []
var parkid_arry = []
var ParkingID = '',AccessToken
Page({
  data: {
    lotNumber: '',
    array: '',
    index: 0,
    items: [{
        name: 'CHN',
        value: '开锁',
        checked: 'true'
      },

    ]
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindKeyInput: function(e) {
    this.setData({
      lotNumber: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    ParkingID = parkid_arry[e.detail.value]
    console.log(ParkingID)
    this.setData({
      index: e.detail.value
    })
  },
  open_lock: function(e) {
    var that = this;
    if (that.data.lotNumber == '') {
      wx.showToast({
        title: "请输入正确的车位号",
        icon: 'none',
      })
      return false
    }

    wx.request({
      url: url + '/public/index.php/wxinterfeace/check_order/check_open_lock', //接口地址
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'lotnumber': that.data.lotNumber,
        'parkingid': ParkingID

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        console.log("kaisuo:" + res.data.Data.Code)
        if (res.data.Result == '1') {
          var parkingID = res.data.Data.ParkingID;
          var orderID = res.data.Data.OrderID;
          var deviceNumber = res.data.Data.DeviceNumber;
          const MsgContent = res.data.Data.MsgContent
          if (res.data.Data.Code == '1') {
            wx.showModal({
              title: '云位订吧',
              content: MsgContent,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../order_ payment/order_ payment?ParkingID=' + parkingID + "&OrderID=" + orderID
                  })
                }
              }
            })
          } else if (res.data.Data.Code == '2') {
            wx.showModal({
              title: '云位订吧',
              content: MsgContent,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../order_detail/order_detail?ParkingID=' + parkingID + "&OrderID=" + orderID,
                  })
                }
              }
            })
          } else if (res.data.Data.Code == '4') {
            wx.showModal({
              title: '云位订吧',
              content: MsgContent,
              showCancel: false,
              success(res) {}
            })
          } else if (res.data.Data.Code == '5') {
            wx.showModal({
              title: '云位订吧',
              content: MsgContent,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../chepai/chepai?OrderType=2&DeviceNumber=' + deviceNumber,
                  })
                }
              }
            })
          } else if (res.data.Data.Code == '6' || res.data.Data.Code == '7' || res.data.Data.Code == '8') {
            wx.showModal({
              title: '云位订吧',
              content: MsgContent,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../fare_payment/fare_payment'
                  })
                }
              }
            })
          } else if (res.data.Data.Code == '10') {
            wx.showModal({
              title: '云位订吧',
              content: MsgContent,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../reserve_order_pay/reserve_order_pay?ParkingID=' + parkingID + "&OrderID=" + orderID,
                  })
                }
              }
            })
          }
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
          wx.navigateTo({
            url: '../authorization/authorization',
          })
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
          })

        }
      },
      fail: function(res) {
        wx.showToast({
          title: '请求失败',
          image: '../../images/public/ic_net_error.png',
        })

      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
    var list = JSON.parse(options.model)
    for (var i = 0; i < list.length; i++) {
      back_arry[i] = list[i].ParkingName
      parkid_arry[i] = list[i].ParkingID
    }
    ParkingID = parkid_arry[this.data.index]
    this.setData({
      array: back_arry
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
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
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