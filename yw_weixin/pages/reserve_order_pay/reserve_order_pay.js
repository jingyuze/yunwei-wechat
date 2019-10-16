// pages/reserve_order_pay/reserve_order_pay.js
const app = getApp()
var url = app.globalData.url
var OrderID, ParkingID, timeStamp, ClickCount = 2
var payType = 'wechat'
var ordercount = 1
var AccessToken; //本地取存储的sessionID
var OrderPayInfoState = 0; //查询到订单后关闭定时器3次
Page({

  /**
   * 页面的初始数据
   */
  data: {
    v_all_show: false,
    ShowInterval: '',
    isIphoneX: false,
    OccupationFee: '',
    ServiceFee: '',
    HintContent: '',
    TotalMoney: '',
    OrderCount:1,
    PromotionalDesc:'',
    countDownNum:180,
    contiune:true
  },
  orderpayinfo: function(parkingid, orderid) {
    var that = this;
    console.log("orderid:" + orderid + "parkingid" + parkingid);
    wx.request({
      url: url + '/public/index.php/wxinterfeace/check_order/pay_reserve_info', //接口地址
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'parkingid': parkingid,
        'orderid': orderid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        var query_clone = res.data;
        console.log(query_clone)
       

        console.log("-+++++++++++++++++++++++++++++++++++++++++++++++++++++")
        if (query_clone.Result == '1') {
          wx.hideLoading();
          wx.redirectTo({
            url: '../order_detail/order_detail?ParkingID=' + parkingid + "&OrderID=" + orderid
          })
        } else {
          if (OrderPayInfoState < 3) {
            wx.showLoading({
              title: '加载中',
            })
            console.log("-----------------------------------------------------------------------")
            setTimeout(function() {
              that.orderpayinfo(parkingid, orderid);
            }, 2000);
            OrderPayInfoState = OrderPayInfoState + 1;
          }
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
  radioChange: function(e) {
    payType = e.detail.value;
    console.log(payType)
  },
  zhifu: function(e) {
    var that = this
    console.log(that.data.contiune)
    if (that.data.contiune){
      that.setData({
        contiune:false
      })
      setTimeout(function(){
        that.setData({
          contiune: true
        })

      },5000)
    const accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    const IP = wx.getStorageSync('IP'); //本地取存储的sessionID
    console.log("accessToken=====" + accessToken)
    console.log("IP=====" + IP)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/add_reserve_order', //接口地址
      method: "POST",
      data: {
        'accesstoken': accessToken,
        'orderid': OrderID,
        'parkingid': ParkingID,
        'ordercount': ordercount
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(query_clone)
        if (query_clone.Result == '1') {
          if (payType == 'wechat') {
            wx.request({
              url: url + '/public/index.php/wxinterfeace/pay_order/pay_wx_reserve_order', //接口地址
              method: "POST",
              data: {
                'accesstoken': accessToken,
                'ip': IP,
                'orderid': OrderID
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: function (res) {
                var query_clone = res.data;
                console.log(query_clone)
                if (query_clone.Result == '1') {
                  timeStamp = query_clone.Data.Timestamp.toString()
                  console.log(typeof (timeStamp))
                  const Noncestr = query_clone.Data.Noncestr
                  console.log("Noncestr=" + Noncestr)
                  const PrepayID = query_clone.Data.PrepayID
                  console.log("PrepayID=" + PrepayID)
                  const Sign = query_clone.Data.Sign
                  console.log("Sign=" + Sign)
                  //ok，开始调支付
                  wx.requestPayment({
                    timeStamp: timeStamp,
                    nonceStr: query_clone.Data.Noncestr,
                    package: query_clone.Data.PrepayID,
                    signType: 'MD5',
                    paySign: query_clone.Data.Sign,
                    success: function () {
                      setTimeout(function () {
                        that.orderpayinfo(query_clone.Data.ParkingID, query_clone.Data.OrderID);
                        OrderPayInfoState = OrderPayInfoState + 1;
                        console.log("orderpayinfo" + query_clone.Data.ParkingID);
                      }, 1000);
                    
                    },
                    fail: function (res) {
                      console.log(res)
                    },
                    complete: function (res) {


                    }

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
          } else {
            wx.request({
              url: url + '/public/index.php/wxinterfeace/pay_order/pay_self_reserve_order', //接口地址
              method: "POST",
              data: {
                'accesstoken': accessToken,
                'orderid': OrderID
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: function (res) {
                var query_clone = res.data;
                console.log(query_clone)
                if (query_clone.Result == '1') {
                  wx.redirectTo({
                    url: '../order_detail/order_detail?ParkingID=' + query_clone.Data.ParkingID + "&OrderID=" + query_clone.Data.OrderID
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
                } else if (query_clone.Result == '2') {
                  wx.showModal({
                    title: '云位订吧',
                    showCancel: false,
                    content: "res.data.Message",
                    success(res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../recharge/recharge',
                        })
                      }
                    }
                  })

                }else {
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
  }else{

    wx.showToast({
      title: '请勿反复点击',
      image: '../../images/public/ic_net_error.png',
    })
  }
  },

  clock_01: function() {
    var that = this
    if (ordercount > 1) {
      ordercount -= 1
      wx.request({
        url: url + '/public/index.php/wxinterfeace/other_update_order/order_time', //接口地址
        method: "POST",
        data: {
          'accesstoken': AccessToken,
          'parkingid': ParkingID,
          'orderid': OrderID,
          "ordercount": ordercount
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          var query_clone = res.data;
          console.log(query_clone)
          if (query_clone.Result == '1') {
            that.setData({
              ShowInterval: query_clone.Data.ShowInterval,
              OccupationFee: query_clone.Data.OccupationFee,
              ServiceFee: query_clone.Data.ServiceFee,
              HintContent: query_clone.Data.HintContent,
              TotalMoney: query_clone.Data.TotalMoney
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
        fail: function(res) {
          wx.showToast({
            title: '没有网络',
            image: '../../images/public/ic_net_error.png',
          })
        },
      })
    } else {
      ordercount = 1
      wx.request({
        url: url + '/public/index.php/wxinterfeace/other_update_order/order_time', //接口地址
        method: "POST",
        data: {
          'accesstoken': AccessToken,
          'parkingid': ParkingID,
          'orderid': OrderID,
          "ordercount": ordercount
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          var query_clone = res.data;
          console.log(query_clone)
          if (query_clone.Result == '1') {
            that.setData({
              ShowInterval: query_clone.Data.ShowInterval,
              OccupationFee: query_clone.Data.OccupationFee,
              ServiceFee: query_clone.Data.ServiceFee,
              HintContent: query_clone.Data.HintContent,
              TotalMoney: query_clone.Data.TotalMoney
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
        fail: function(res) {
          wx.showToast({
            title: '没有网络',
            image: '../../images/public/ic_net_error.png',
          })
        },
      })
      wx.showModal({

        content: "亲，系统最少为您保留"+(that.data.ShowInterval*60)+"分钟哦!",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {

          }
        }
      });
    }
  },
  clock_02: function() {
    var that = this
    if (ordercount < ClickCount) {
      ordercount += 1
      wx.request({
        url: url + '/public/index.php/wxinterfeace/other_update_order/order_time', //接口地址
        method: "POST",
        data: {
          'accesstoken': AccessToken,
          'parkingid': ParkingID,
          'orderid': OrderID,
          "ordercount": ordercount
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          var query_clone = res.data;
          console.log(query_clone)
          if (query_clone.Result == '1') {
            that.setData({
              ShowInterval: query_clone.Data.ShowInterval,
              OccupationFee: query_clone.Data.OccupationFee,
              ServiceFee: query_clone.Data.ServiceFee,
              HintContent: query_clone.Data.HintContent,
              TotalMoney: query_clone.Data.TotalMoney
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
        fail: function(res) {
          wx.showToast({
            title: '没有网络',
            image: '../../images/public/ic_net_error.png',
          })

        },
      })
    } else {
      wx.showModal({
        content: "亲，系统最多为您保留"+(60 * that.data.ShowInterval)+"分钟哦！",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {

          }
        }
      });
    }
    console.log("ordercount"+ordercount)
  },
//获取设备信息是否为iphonex
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isIphoneX: this.isIphoneX()
    })
    console.log(payType)
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    AccessToken = accessToken;
    console.log("传过来的OrderID=" + options.OrderID)
    console.log("传过来的ParkingID=" + options.ParkingID)
    OrderID = options.OrderID
    ParkingID = options.ParkingID

    console.log("accessToken=====" + accessToken)
    

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
    payType = 'wechat'
    var accessToken = wx.getStorageSync('AccessToken');
    AccessToken = accessToken;
    var that = this;
    console.log("AccessToken===" + AccessToken)
    console.log("ParkingID===" + ParkingID)
    console.log("OrderID===" + OrderID)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/reserve_order_info', //接口地址
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'parkingid': ParkingID,
        'orderid': OrderID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(query_clone)
        if (query_clone.Result == '1') {
          var reserveTime = query_clone.Data.ReserveTime;
          console.log("reserveTime============================" + reserveTime)
          var format = reserveTime.replace(/-/g, '/')
          console.log(typeof (reserveTime))
          const timee = new Date().getTime()
          console.log("timee==" + timee)
          const timeer = Date.parse(format)
          console.log(timeer)
          var timecount = Math.floor(180 - (timee - timeer) / 1000);
          if (timecount<=0){
            timecount = 0
          }
          console.log(timecount)
          ordercount = query_clone.Data.OrderCount;
          console.log("ordercount:" + ordercount);
          that.setData({
            result: query_clone.Data,
            OccupationFee: query_clone.Data.OccupationFee,
            ServiceFee: query_clone.Data.ServiceFee,
            HintContent: query_clone.Data.HintContent,
            TotalMoney: query_clone.Data.TotalMoney,
            ShowInterval: query_clone.Data.ShowInterval,
            OrderCount: query_clone.Data.OrderCount,
            PromotionalDesc: query_clone.Data.PromotionalDesc,
            countDownNum: timecount
          })
          that.countDown();
          ClickCount = res.data.Data.ClickCount
          console.log("最多点击次数=" + ClickCount)
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

      }, complete() {
        that.setData({
          v_all_show: true
        });
      }
    })
  },
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum; //获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () { //这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum <= 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          that.setData({
            timeout: true,
            yincang: true
          })
          // wx.showModal({
          //   content: "亲，已超过支付规定时间，请重新预订",
          //   showCancel: false,
          //   success: function (res) {
          //     if (res.confirm) {

          //     }
          //   }
          // });
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
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