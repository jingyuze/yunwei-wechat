// pages/list_detail/list_detail.js
const app = getApp()
var url = app.globalData.url
var lotid = ''
var ParkingID, devicenumber, accessToken = '';
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
  pay_info: function (event){
    var that = this
    console.log(event.currentTarget.dataset.alphaBeta)
    wx.showModal({
      title: '云位订吧',
      showCancel:false,
      content: that.data.button[event.currentTarget.dataset.alphaBeta].Feescale,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
         
        }
      }
    })
  },
  qiehuan: function() {
    wx.request({
      url: url + '/public/index.php/wxinterfeace/park_info/park_single_url', //接口地
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'parkingid': ParkingID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var query_clone = res.data;
        if (query_clone.Result == '1') {
          wx.redirectTo({
            url: '../webview/webview?webUrl=' + query_clone.Data.WebUrl + "&parkingID=" + query_clone.Data.ParkingID
          });
        } else if (query_clone.Result == '2000') {
          wx.clearStorage()
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
            icon: 'none',
          })

        }

      },
      fail: function(res) {
        wx.showToast({
          title: '没有网络',
          image: '../../images/public/ic_net_error.png',
        })
      },
    })

  },
  yuding: function(event) {
    var id = event.currentTarget.dataset.id;
    console.log("当前点击组件的索引为" + id)
    var devicenumb = devicenumber[id].DeviceNumber
    //开锁先进行订单检查
    console.log("accessToken=====" + accessToken)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/check_scan_code_order', //接口地址
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'devicenumber': devicenumb
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        console.log(res.data)
        console.log(res.data.Data.Code)
        if (res.data.Result == '1') {
          var parkingID = res.data.Data.ParkingID;
          var orderID = res.data.Data.OrderID;
          const MsgContent = res.data.Data.MsgContent
          if (res.data.Data.Code == '5') {
            wx.showModal({
              title: '云位订吧',
              content: "到达车位后手动开锁，确认预订该车位？",
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../chepai/chepai?OrderType=1&DeviceNumber=' + devicenumb,
                  })
                }
              }
            })
          } else if (res.data.Data.Code == '1') {
            wx.showModal({
              title: '云位订吧',
              content: MsgContent,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../order_ payment/order_ payment?ParkingID=' + parkingID + "&OrderID=" + orderID,
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
                  console.log('用户点击确定')
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
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../occupied/occupied',
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
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../fare_payment/fare_payment',
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
                  console.log('用户点击确定')
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
            icon: 'warn',
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
          title: '没有网络',
          image: '../../images/public/ic_net_error.png',
        })
      },
    })
  },
  kaisuo: function(event) {
    var id = event.currentTarget.dataset.id;
    console.log("当前点击组件的索引为" + id)
    var devicenumb = devicenumber[id].DeviceNumber
    //开锁先进行订单检查
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    console.log("accessToken=====" + accessToken)
    console.log("devicenumber=====" + devicenumb)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/check_scan_code_order', //接口地址
      method: "POST",
      data: {
        'accesstoken': accessToken,
        'devicenumber': devicenumb
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        console.log("kaisuo:" + res.data.Data.Code)
        if (res.data.Result == '1') {
          var parkingID = res.data.Data.ParkingID;
          var orderID = res.data.Data.OrderID;
          const MsgContent = res.data.Data.MsgContent
          if (res.data.Data.Code == '5') {
            wx.showModal({
              title: '云位订吧',
              content: "支付后自动开锁，确认使用该车位？",
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../chepai/chepai?OrderType=2&DeviceNumber=' + devicenumb,
                  })
                }
              }
            })
          } else if (res.data.Data.Code == '1') {
            wx.showModal({
              title: '云位订吧',
              content: MsgContent,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../order_ payment/order_ payment?ParkingID=' + parkingID + "&OrderID=" + orderID,
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
                  console.log('用户点击确定')
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
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../occupied/occupied?ParkingID=' + parkingID + "&OrderID=" + orderID,
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
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../fare_payment/fare_payment',
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
                  console.log('用户点击确定')
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
    ParkingID = options.ParkingID
    console.log("传递过来的ParkingID是" + ParkingID)
    console.log("传递过来的ParkingID类型是" + typeof(ParkingID))
    accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    console.log("accessToken=====" + accessToken)
    console.log("accessToken类型" + typeof(accessToken))
    //渲染加载

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
    var that = this;
    wx.request({
      url: url + '/public/index.php/wxinterfeace/park_info/park_available_lot_list',
      method: 'POST',
      data: {
        'accesstoken': accessToken,
        'parkingid': ParkingID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        console.log("进入success了")
        if (res.data.Result == '1') {
          devicenumber = res.data.Data.LotList
          console.log(devicenumber)
          if (devicenumber.length == 0) {
            that.setData({
              xixi: false,
            })
          }
          that.setData({
            button: res.data.Data.LotList,
          })
          console.log("要循环渲染的值为" + res.data.Data.LotList)

        } else {
          console.log("网络错误")
          wx.showToast({
            title: '没有网络',
            icon: 'warn',
          })

        }

      }

    })
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