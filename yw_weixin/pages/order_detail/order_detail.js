const app = getApp()
var url = app.globalData.url;
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
var AccessToken, screenwidth, screenheight;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    v_all_show: false,
    result: null,
    parkingid: "0",
    orderid: "0",
    webUrl:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onChangeShowState: function() {
    var that = this;
    that.setData({

    })
  },
  look_map:function(e){
    var that = this;
    var getTimestamp = new Date().getTime();
    const web_url = that.data.webUrl + "?parkingid=" + that.data.parkingid + '&screenwidth=' + screenwidth + '&screenheight=' + screenheight + "&userid=&devicetype=3&pagetype=2&floor=1&accesstoken=" + AccessToken + '&getTimestamp=' + getTimestamp
    wx.navigateTo({
      url: '../webview/webview?webUrl=' + encodeURIComponent(web_url)
    });
  },
  cancel: function (e) {
    var that = this;

    wx.showModal({
      title: '云位订吧',
      content: "取消当前订单?",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: url + '/public/index.php/wxinterfeace/cancel_order/cancel_reserve_order', //接口地址
            method: "POST",
            data: {
              'accesstoken': AccessToken,
              'parkingid': that.data.parkingid,
              'orderid': that.data.orderid
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
              var query_clone = res.data;
              console.log(query_clone)
              if (query_clone.Result == '1') {
                wx.redirectTo({
                  url: '../map/map'
                });
                wx.showToast({
                  title: "订单取消成功！",
                  icon: 'none',
                })

              } else if (query_clone.Result == '2000') {
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
        }
      }
    })

    
  },
  open_lock: function() {
    var that = this;
    var accessToken = wx.getStorageSync('AccessToken');
    wx.showModal({
      title: '云位订吧',
      content: "请到达车位后开锁，否则会被占用!",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: url + '/public/index.php/wxinterfeace/open_lock/open_lock',
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            data: {
              'accesstoken': AccessToken,
              'parkingid': that.data.parkingid,
              'orderid': that.data.orderid
            },
            //请求后台数据成功 
            success: function (res) {
              console.log(res.data);
              if (res.data.Result == '1') {
                
                wx.showModal({
                  title: '云位订吧',
                  content: "正在为您解锁，网络原因，可能有延时，请稍等！车位锁打开后，请及时入位",
                  success(res) {
                    if (res.confirm) {
                      
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
              } else if (res.data.Result == '2') {
                wx.showToast({
                  title: res.data.Message,
                  icon: 'none',
                })
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
                  title: '网络错误',
                  icon: 'warn',
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })
    
  },
  onLoad: function(options) {
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
    var accessToken = wx.getStorageSync('AccessToken');
    AccessToken = accessToken;
    var that = this;
    var parkingid = options.ParkingID;
    var orderid = options.OrderID;
    console.log(parkingid)
    console.log(orderid)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/order_details_info',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
        'accesstoken':  AccessToken,
        'parkingid': parkingid,
        'orderid': orderid
      },
      //请求后台数据成功 
      success: function(res) {
        console.log(res.data);
        if (res.data.Result == '1') {
          that.setData({
            result: res.data.Data,
            parkingid: parkingid,
            orderid: orderid,
            webUrl: res.data.Data.LotMap
          })

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
            title: '网络错误',
            icon: 'warn',
            duration: 1000
          })
        }

      },fail(){
        wx.showToast({
          title: '请求失败！',
          image: '../../images/public/ic_error.png',
        })
      }, complete() {
        that.setData({
          v_all_show: true
        });
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
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
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
  onShareAppMessage: function() {
    var that = this;
    return {
      title: '云位订吧',
      imageUrl: "/images/zhuanfa.jpg",
      path: '/pages/onLoad/onLoad',
      success: function(res) {
        // 转发成功

        that.shareClick();
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})