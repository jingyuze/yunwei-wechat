// pages/recharge/recharge.js
const app = getApp()
var url = app.globalData.url
var AccessToken, OrderNumber, timeStamp, orderid;
var OrderPayInfoState = 0; //查询到订单后关闭定时器3次
var listdata= []
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    list: ['0.01', '20', '30', '50', '70', '100']
  },
  orderpayinfo: function (orderid) {
    var that = this;
    console.log("orderid:" + orderid);
    wx.request({
      url: url + '/public/index.php/wxinterfeace/check_order/pay_recharge_info', //接口地址
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'orderid': orderid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(query_clone)
        if (query_clone.Result == '1') {
          that.onLoad()
        } else {
          if (OrderPayInfoState < 3) {
            console.log("轮询")
            setTimeout(function () {
              that.orderpayinfo(orderid);
            }, 1000);
            OrderPayInfoState = OrderPayInfoState + 1;
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

  },
  recharge:function(event){
    var that = this
    console.log(event.currentTarget.dataset.a)
    console.log(that.data.list)
    listdata = that.data.list
    console.log(listdata)
    console.log(that.data.list[event.currentTarget.dataset.a])
    wx.request({
      url: url + '/public/index.php/wxinterfeace/recharge/add_recharge_order', //接口地
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        ordermoney: that.data.list[event.currentTarget.dataset.a]
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        console.log(query_clone.Data)
        if (query_clone.Result == '1') {
          OrderNumber = query_clone.Data.OrderNumber
          console.log("取到的订单编号" + OrderNumber)
          //开始支付
          //订单支付
          const IP = wx.getStorageSync('IP'); //本地取存储的sessionID
          console.log("accessToken=====" + AccessToken)
          console.log("IP=====" + IP)
          console.log("IP数据类型" + typeof (IP))
          wx.request({
            url: url + '/public/index.php/wxinterfeace/pay_order/pay_wx_recharge_order', //接口地址
            method: "POST",
            data: {
              'accesstoken': AccessToken,
              'ip': IP,
              'ordernumber': OrderNumber
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
              var query_clone = res.data;
              console.log(query_clone.Data)
              console.log(query_clone.Data.OrderID)
              orderid = query_clone.Data.OrderID
              console.log(res.data.Message)
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
                  
                    console.log('支付成功');
                    setTimeout(function () {
                      that.orderpayinfo(orderid);
                      OrderPayInfoState = OrderPayInfoState + 1;
                      
                    }, 1000);
                  },
                  fail: function (res) {
                    console.log(res)
                  },
                  complete: function (res) {


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
            fail: function (res) {
              wx.showToast({
                title: '没有网络',
                image: '../../images/public/ic_net_error.png',
              })

            },
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
    var that = this
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
    console.log(AccessToken)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/recharge/money_info', //接口地
      method: "POST",
      data: {
        'accesstoken': AccessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        console.log(query_clone.Data)
        if (query_clone.Result == '1') {
          that.setData({
            money: query_clone.Data.Money
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