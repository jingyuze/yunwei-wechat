// pages/order_ payment /order_ payment .js
const app = getApp()
var url = app.globalData.url
var OrderID,ParkingID,timeStamp = ''
var payType = 'wechat';
var AccessToken;
var OrderPayInfoState = 0; //查询到订单后关闭定时器3次
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    v_all_show: false,
    parkingid: "0",
    orderid: "0",
    timeout: false,
    isIphoneX: false,
    lot: '',
    plain: true,
    yincang: false,
    contiune: true,
    timer: '', //定时器名字
    countDownNum: '180' ,//倒计时初始值
    reserveTime:""
  },
  orderpayinfo: function(parkingid, orderid) {
    var that = this;
    console.log("orderid:" + orderid + "parkingid" + parkingid);
    wx.request({
      url: url + '/public/index.php/wxinterfeace/check_order/pay_open_lock_info', //接口地址
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
        if (query_clone.Result == '1') {
          wx.redirectTo({
            url: '../fare_payment/fare_payment?ParkingID=' + query_clone.Data.ParkingID + "&OrderID=" + query_clone.Data.OrderID
          })
        } else {
          if (OrderPayInfoState < 3) {
            setTimeout(function() {
              that.orderpayinfo(parkingid, orderid);
            }, 1000);
            OrderPayInfoState = OrderPayInfoState+1;
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
    var that = this
    payType = e.detail.value;
    that.setData({
      contiune: true
    })
  },
  zhifu: function(e) {
    var that = this
    console.log(that.data.contiune)
    if (that.data.contiune) {
      that.setData({
        contiune: false
      })
      setTimeout(function () {
        that.setData({
          contiune: true
        })

      }, 5000)
    const accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    const IP = wx.getStorageSync('IP'); //本地取存储的sessionID
    AccessToken = accessToken;
    console.log("accessToken=====" + accessToken)
    console.log("IP=====" + IP)
    console.log("payType=====" + payType)
    if (payType == 'wechat') {
      wx.request({
        url: url + '/public/index.php/wxinterfeace/pay_order/pay_wx_occupy_order', //接口地址
        method: "POST",
        data: {
          'accesstoken': accessToken,
          'ip': IP,
          'orderid': OrderID
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          var query_clone = res.data;
          console.log(query_clone)
          if (query_clone.Result == '1') {
            timeStamp = query_clone.Data.Timestamp.toString()
            console.log(typeof(timeStamp))
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
              success: function() {
                //语音提示正在打开车位锁
                plugin.textToSpeech({
                  lang: "zh_CN",
                  tts: true,
                  content: "正在打开车位锁，请稍等",
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
                setTimeout(function() {
                  that.orderpayinfo(query_clone.Data.ParkingID, query_clone.Data.OrderID);
                  OrderPayInfoState = OrderPayInfoState + 1;
                  console.log("orderpayinfo" + query_clone.Data.ParkingID);
                }, 1000);
                //加入订单表做记录
              
              },
              fail: function(res) {
                wx.showToast({
                  title: "请求失败",
                  icon: 'none'
                })
              },
              complete: function(res) {

              }
            })
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
    } else {
      wx.request({
        url: url + '/public/index.php/wxinterfeace/pay_order/pay_self_occupy_order', //接口地址
        method: "POST",
        data: {
          'accesstoken': accessToken,
          'orderid': OrderID
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          var query_clone = res.data;
          console.log(query_clone)
          if (query_clone.Result == '1') {
            wx.redirectTo({
              url: '../fare_payment/fare_payment?ParkingID=' + query_clone.Data.ParkingID + "&OrderID=" + query_clone.Data.OrderID
            })
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
    }
  }else{

    wx.showToast({
      title: '请勿反复点击',
      image: '../../images/public/ic_net_error.png',
    })
  }
  },
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum; //获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function() { //这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          that.setData({
            timeout: true,
            yincang: true
          })
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //支付：：：：
  pay: function() {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        wx.request({
          //这里是后台的处理方法，url是自定义的，直接换成你自己的后台处理方法即可，Wx_Pay这个方法在下面写的有
          //后台用的php做处理，java的可以参考方法，道理都是一样的
          url: url + 'Wx_Pay',
          data: {
            //用户的openid
            openid: res.data,
            fee: that.data.totalPrice, //支付金额
            details: that.data.goodsList[0].goods_name, //支付商品的名称
          },
          success: function(result) {
            if (result.data) {

              wx.requestPayment({
                timeStamp: result.data['timeStamp'],
                nonceStr: result.data['nonceStr'],
                package: result.data['package'],
                signType: 'MD5',
                paySign: result.data['paySign'],
                'success': function(successret) {
                  console.log('支付成功');
                  //获取支付用户的信息
                  wx.getStorage({
                    key: 'userInfo',
                    success: function(getuser) {
                      //加入订单表做记录
                      wx.request({
                        url: url + 'Wx_AddOrder',
                        data: {
                          uname: getuser.data.nickName,
                          goods: that.data.goodsList[0].goods_name,
                          price: that.data.totalPrice,
                          openid: res.data,
                        },
                        success: function(lastreturn) {
                          console.log("存取成功");
                        }
                      })
                    },
                  })
                },
                'warn': function(res) {
                  wx.showToast({
                    title: '支付失败',
                    image: '../../images/public/ic_error.png',
                  })
                }
              })
            }
          }
        })
      },
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
    this.setData({
      isIphoneX: this.isIphoneX()
    })
    OrderPayInfoState = 0;
    //出发定时器


    console.log("传过来的OrderID=" + options.OrderID)
    console.log("传过来的ParkingID=" + options.ParkingID)
    OrderID = options.OrderID
    ParkingID = options.ParkingID
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    AccessToken = accessToken;
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
    var that = this;
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    AccessToken = accessToken;
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/occupy_order_info', //接口地址
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
          var format = reserveTime.replace(/-/g, '/')
          const timeer = Date.parse(format)
          console.log(timeer)
          var timecount = Math.floor(180 - (new Date().getTime() - timeer)/1000);
          if (timecount <= 0) {
            timecount = 0
          }
          that.setData({
            result: query_clone.Data,
            parkingid: ParkingID,
            orderid: OrderID,
            countDownNum:timecount
          })
          that.countDown();
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