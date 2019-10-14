// pages/fare_payment/fare_payment.js
const app = getApp();
var url = app.globalData.url;
var OrderID, timeStamp, Type, OrderNumber = '';
var AccessToken;
var OrderPayInfoState = 0; //查询到订单后关闭定时器3次
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timeout: false,
    show: false,
    showView: false,
    xixi: false,
    contiune: true
  },
  hide: function() {
    console.log("hide")
    this.setData({
      showView: false,
    })
  },
  orderpayinfo: function(parkingid, orderid) {
    var that = this;
    console.log("orderid:" + orderid + "parkingid" + parkingid);
    wx.request({
      url: url + '/public/index.php/wxinterfeace/check_order/pay_finish_info', //接口地址
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    AccessToken = accessToken;
    console.log("accessToken=====" + accessToken)
    var that = this
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/order_info', //接口地址
      method: "POST",
      data: {
        'accesstoken': accessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        var query_clone = res.data;
        console.log(query_clone.Data)
        Type = query_clone.Data.Type
        console.log("Type=" + Type)
        console.log(res.data.Message)
        OrderID = query_clone.Data.OrderID
        console.log("OrderID=" + OrderID)
        if (query_clone.Result == '1') {
          if (query_clone.Data == '') {
            that.setData({
              xixi: true,
            })
          } else {
            that.setData({
              show: true,
              result: query_clone.Data,
            })
          }
          if (query_clone.Data.Type == '2' || query_clone.Data.Type == '4') {

            that.setData({
              timeout: true,
            })
          }
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
          that.setData({
            xixi: true
          })


        }
      },
      fail: function(res) {
        wx.showToast({
          title: '没有网络',
          image: '../../images/public/ic_net_error.png',
        })
      },
      complete() {
        that.setData({
          v_all_show: true
        });
      }
    })
  },
  slidi_up: function() {
    console.log("slideup")
    var that = this
    that.setData({
      showView: true,
    })
  },

  //充值支付
  save_pay: function() {
    var that = this
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    console.log("accessToken=====" + accessToken)
    console.log("orderid=====" + OrderID)
    that.setData({
      showView: false,
    })
    //添加订单
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/add_finish_order', //接口地址
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
        OrderNumber = query_clone.Data.OrderNumber
        console.log("OrderNumber=" + OrderNumber)
        if (query_clone.Result == '1') {
          console.log(res.data.Message)
          that.chongzhi(query_clone.Data.ParkingID, query_clone.Data.OrderID)
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
  //确认支付
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
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    console.log("accessToken=====" + accessToken)
    console.log("orderid=====" + OrderID)
  
    that.setData({
      showView: false,
    })
    //添加订单
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/add_finish_order', //接口地址
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
        OrderNumber = query_clone.Data.OrderNumber
        console.log("OrderNumber=" + OrderNumber)
        if (query_clone.Result == '1') {
          console.log(res.data.Message)
          that.fengzhuang(query_clone.Data.ParkingID, query_clone.Data.OrderID)
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
    }else {

      wx.showToast({
        title: '请勿反复点击',
        image: '../../images/public/ic_net_error.png',
      })

    }
  },

  chongzhi: function(parkingid, orderid) {
    //充值支付
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
    console.log("OrderNumber=====" + OrderNumber)
    console.log("OrderNumber数据类型" + typeof(OrderNumber))
    const accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    const IP = wx.getStorageSync('IP'); //本地取存储的sessionID
    console.log("accessToken=====" + accessToken)
    console.log("IP=====" + IP)
    console.log("IP数据类型" + typeof(IP))
    wx.request({
      url: url + '/public/index.php/wxinterfeace/pay_order/pay_self_finish_order', //接口地址
      method: "POST",
      data: {
        'accesstoken': accessToken,
        'ordernumber': OrderNumber
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        var query_clone = res.data;
        console.log(query_clone.Data)
        console.log(query_clone.Data.OrderID)
        console.log(res.data.Message)
        if (query_clone.Result == '1') {

          //ok，开始调支付
          setTimeout(function() {
            that.orderpayinfo(parkingid, orderid);
            OrderPayInfoState = OrderPayInfoState + 1;
            console.log("orderpayinfo" + query_clone.Data.ParkingID);
          }, 1000);
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

      wx.showToast({
        title: '请勿反复点击',
        image: '../../images/public/ic_net_error.png',
      })

    }

  },


  fengzhuang: function(parkingid, orderid) {
    var that = this
    //订单支付
    console.log("OrderNumber=====" + OrderNumber)
    console.log("OrderNumber数据类型" + typeof(OrderNumber))
    const accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
    const IP = wx.getStorageSync('IP'); //本地取存储的sessionID
    console.log("accessToken=====" + accessToken)
    console.log("IP=====" + IP)
    console.log("IP数据类型" + typeof(IP))
    wx.request({
      url: url + '/public/index.php/wxinterfeace/pay_order/pay_wx_finish_order', //接口地址
      method: "POST",
      data: {
        'accesstoken': accessToken,
        'ip': IP,
        'ordernumber': OrderNumber
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        var query_clone = res.data;
        console.log(query_clone.Data)
        console.log(query_clone.Data.OrderID)
        console.log(res.data.Message)

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
              wx.redirectTo({
                url: '../fare_payment/fare_payment'
              })
              console.log('支付成功');
              setTimeout(function() {
                that.orderpayinfo(parkingid, orderid);
                OrderPayInfoState = OrderPayInfoState + 1;
                console.log("orderpayinfo" + query_clone.Data.ParkingID);
              }, 1000);
            },
            fail: function(res) {
              console.log(res)
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