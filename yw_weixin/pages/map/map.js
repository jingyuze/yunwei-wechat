// pages/map/map.js
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const wxMap = new QQMapWX({
  key: 'AJMBZ-5QZ6S-LBQOH-6I7HB-DLRNF-X6BCY' // 必填
});
const util = require("../../utils/util.js")
var url = app.globalData.url
var item, ParkingID, latitude, longitude, modell, parkingid, devicenumber, OrderType, scene, daohang, screenwidth, screenheight = '';
var markes_new = [{}]
var ary = [{}]
var AccessToken; //本地取存储的sessionID
Page({
  /**:'',
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    latitude: '',
    longitude: '',
    hidden: false,
    isIphoneX: false,
    chooseAddress:'你想停哪儿？',
    content: '',
    ParkingName: '',
    Address: '',
    AvailableLot: '',
    Feescale: '',
    markers: [],
    img:'/images/public/dingwei@3x.png'
  },
  regionchange(e) {
    console.log(e.type)
  },


  controltap(e) {
    console.log(e.controlId)
  },
  order: function () {
    wx.navigateTo({
      url: '../order_list/order_list'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  markertap: function(red) {
    console.log("点击了mark")
    console.log(red.markerId)
    ParkingID = ary[red.markerId].ParkingID;
    console.log("需要传到下个页面的ParkingID=" + ParkingID)
    if (ary[red.markerId].InfoTransformation == '1') {
      const that = this
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
          console.log(res.data)
          daohang = res.data
          if (query_clone.Result == '1') {
            that.setData({
              hidden: true,
              ParkingName: query_clone.Data.ParkingName,
              Address: query_clone.Data.Address,
              Feescale: query_clone.Data.Feescale,
              AvailableLot: query_clone.Data.AvailableLot,
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
    } else {
      this.setData({
        hidden: false
      })
      wx.showModal({
        content: '该停车场正在建设中，敬请期待',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {

          }
        }
      });
    }
  },
  convenient: function() {
    wx.navigateTo({
      url: '../convenient_unlock/convenient_unlock'
    })
  },
  daohang:function(){
    console.log(daohang)
    wx.openLocation({
      latitude: daohang.Data.Latitude,
      longitude: daohang.Data.Longitude,
      scale: 18
    })

  },
  dingwei: function() {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        latitude = res.latitude
        longitude = res.longitude
        console.log(res.latitude, res.longitude)
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '',
                content: '请允许获取您的定位',
                confirmText: '授权',
                success: function (res) {
                  if (res.confirm) {

                    _this.openSetting();
                  } else {
                    console.log('get location fail');
                  }
                }
              })
            } else {
              //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              wx.showModal({
                title: '',
                content: '请在系统设置中打开定位服务',
                confirmText: '确定',
                success: function (res) {
                  getCurrentPages()[getCurrentPages().length - 1].onLoad()
                }
              })
            }
          }
        })

      }
    })  
  },
  bind: function() {
    const that = this
    that.setData({
      hidden: false
    })
  },
  list: function() {
    wx.navigateTo({
      url: '../vacancy_list/vacancy_list?ParkingID=' + ParkingID,
    })

  },
  photo: function() {
    var that =this
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
        console.log("park_single_url-query_clone:" + query_clone.Data.WebUrl)
        var getTimestamp = new Date().getTime();
        console.log(ParkingID)
        const web_url = query_clone.Data.WebUrl + "?parkingid=" + ParkingID + '&screenwidth=' + screenwidth + '&screenheight=' + screenheight + "&userid=&devicetype=3&floor=1&accesstoken=" + AccessToken + '&getTimestamp=' + getTimestamp
        if (query_clone.Result == '1') {
          wx.navigateTo({
            url: '../webview/webview?webUrl=' + encodeURIComponent(web_url)
          });
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
  order: function() {
    wx.navigateTo({
      url: '../order_list/order_list'
    })
  },
  caidan: function() {
    wx.navigateTo({
      url: '../list/list',
    })
  },
  kaisuo: function() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.path){
        var url = res.result;
        let qrId = decodeURIComponent(res.path)
        console.log(qrId)
        console.log(typeof(qrId))
        devicenumber = qrId.substr(-9, 8)
        OrderType = qrId.substr(-1, 1)

        console.log("OrderType=" + OrderType)
        console.log("devicenumber=" + devicenumber)
        if (devicenumber != '' && OrderType != '') {
          wx.navigateTo({
            url: '../chepai/chepai?DeviceNumber=' + devicenumber + '&OrderType=' + OrderType
          })
        } else {
          wx.showToast({
            title: '扫码失败',
            icon: 'none'
          })
        }
      }else{
          wx.showToast({
            title: '请扫描正确的小程序码',
            icon: 'none'
          })
      }
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码取消',
          icon: 'none'
        })
      }
    })
  },
  reverseGeocoder() {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        latitude = res.latitude
        longitude = res.longitude
        console.log(res.latitude, res.longitude)
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail:function(){
        console.log("不得行")
        wx.authorize({ scope: "scope.userLocation" })
      }
    })
  },
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
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
    this.setData({
      isIphoneX: this.isIphoneX()
    })
    console.log(options)
    var that = this
    if (options.model) {
      var list = JSON.parse(options.model)
      console.log(list.latitude)
      console.log(list.longitude)
      console.log(list.addr)
      that.setData({
        latitude: list.latitude,
        longitude: list.longitude,
        chooseAddress: list.title
      });

    }else{
      var _this = this;
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          latitude = res.latitude
          longitude = res.longitude
          console.log(res.latitude, res.longitude)
          _this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          });
        },
        fail:function(){
          wx.getSetting({
            success: function (res) {
              if (!res.authSetting['scope.userLocation']) {
                wx.showModal({
                  title: '',
                  content: '请允许获取您的定位',
                  confirmText: '授权',
                  success: function (res) {
                    if (res.confirm) {

                      _this.openSetting();
                    } else {
                      console.log('get location fail');
                    }
                  }
                })
              } else {
                //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
                wx.showModal({
                  title: '',
                  content: '请在系统设置中打开定位服务',
                  confirmText: '确定',
                  success: function (res) {
                    getCurrentPages()[getCurrentPages().length - 1].onLoad()
                  }
                })
              }
            }
          })

        }
      })
    }
    markes_new.length = 0;
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
    if (options.scene) {
      scene = decodeURIComponent(options.scene)
      console.log('启动小程序的场景值:', scene)
      devicenumber = scene.substr(-9, 8)
      OrderType = scene.substr(-1, 1)
      console.log("OrderType=" + OrderType)
      console.log("devicenumber=" + devicenumber)
      var loginState = wx.getStorageSync('LoginState');
      console.log("loginState:" + loginState);
      if (!loginState) {
        wx.navigateTo({
          url: '../authorization/authorization?OrderType=' + OrderType + '&DeviceNumber=' + devicenumber,
        })
      } else {
        if (options.scene) {
          wx.navigateTo({
            url: '../chepai/chepai?DeviceNumber=' + devicenumber + '&OrderType=' + OrderType
          })
        }
      }
    } else {
     
    console.log("没有scence")
     //正常流程订单检查
      var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
      console.log("accessToken=====" + accessToken)
      wx.request({
        url: url + '/public/index.php/wxinterfeace/check_order/check_no_pay_order', //接口地址
        method: "POST",
        data: {
          'accesstoken': accessToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          console.log(res.data)
          console.log("0000000000000000====" + res.data.Data.ParkingID)
          var parkingID = res.data.Data.ParkingID;
          var orderID = res.data.Data.OrderID;
          if (res.data.Result == '1') {
            parkingid = res.data.Data.ParkingID
           
            const MsgContent = res.data.Data.MsgContent
            console.log("chepai:" + res.data.Data.Code)
            if (res.data.Data.Code == '1') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../order_ payment/order_ payment?ParkingID=' + parkingID + "&OrderID=" + orderID
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                   
                  }
                }
              })


            } else if (res.data.Data.Code == '2') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../order_detail/order_detail?ParkingID=' + parkingID + "&OrderID=" + orderID,
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                   
                  }
                }
              })

            } else if (res.data.Data.Code == '5') {

            } else if (res.data.Data.Code == '4') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../occupied/occupied?ParkingID=' + parkingID + "&OrderID=" + orderID,
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
            
                  }
                }
              })

            } else if (res.data.Data.Code == '6' || res.data.Data.Code == '7' || res.data.Data.Code == '8') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../fare_payment/fare_payment',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
           
                  }
                }
              })

            } else if (res.data.Data.Code == '10') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../reserve_order_pay/reserve_order_pay?ParkingID=' + parkingid + "&OrderID=" + orderID,
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
               
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
        fail: function (res) {
          wx.showToast({
            title: '请求失败',
            image: '../../images/public/ic_net_error.png',
          })
        },

        complete: function () {


        }
      })



    }
    var that = this
    wx.request({
      url: url + '/public/index.php/wxinterfeace/park_info/park_location', //接口地址
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var query_clone = res.data;
        console.log(query_clone.Data)
        console.log(res.data.Message)
        if (query_clone.Result == '1') {
          for (let i = 0; i < query_clone.Data.length; i++) {
            markes_new.push({
              id: i,
              latitude: query_clone.Data[i].Latitude,
              longitude: query_clone.Data[i].Longitude,
              width: 30,
              height: 54,
              iconPath: "/images/zhongdian@2x.png",
            })

          }
          ary = query_clone.Data
         
          console.log(markes_new)
          console.log(ary)
          that.setData({
            markers: markes_new
          })
        }

      },
      fail: function(res) {
        console.log("失败")

      },
    })
   
    //检查是否存在新版本
 
  },
  //便捷开锁：
  convenient: function() {
    if (longitude || latitude){
    console.log(longitude + "-" + latitude)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/park_info/park_list', //接口地址
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'longitude': longitude,
        'latitude': latitude
      },
      success: function(res) {
        var query_clone = res.data;
        console.log(res.data)
        if (query_clone.Result == '1') {
          console.log(res.data.Message)
          if (query_clone.Data.length == 0) {
            wx.showToast({
              title: '无法获取位置',
              icon: 'warn',
            })
          } else {
            // for (let i = 0; i < query_clone.Data.length;i++){

            modell = JSON.stringify(query_clone.Data);
            // }
            console.log(modell)
            //转至便捷开锁
            setTimeout(function() {
              wx.navigateTo({
                url: '../convenient_unlock/convenient_unlock?model=' + modell,
              })
            }, 500)
          }
        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'warn',
          })
        }

      },
      fail: function(res) {
        wx.showToast({
          title: '没有网络',
          icon: 'warn',
        })

      },
    })
  }else{
      wx.showModal({
        content: '无法获取位置',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          }
        }
      });
  }
  },
  bindInput: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../order/order'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function(options) {
    
    
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
    this.setData({
      hidden: false
    })
    // this.reverseGeocoder()
  },
  onReady:function(){
    
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