// pages/fixed_car/fixed_car.js
const app = getApp()
var url = app.globalData.url
var back_arry = []
var list
var ParkingID, rentid, chepai, OrderNumber, AllowState, BottomNotify, iRentID = '';
var AccessToken;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mydata: '',
    showView: false,
    money:'',
    show:false,
    Result:'',
    message:'',
    chepai: '',
    xixi: false,
    RentUnitPrice: '',
    return_data:'',
    RentMoney: '',
    chepai: '',
    inde: 0,
    contiune: true
  },
  hide: function () {
    console.log("hide")
    this.setData({
      showView: false,
    })
  },
  slidi_up: function () {
    console.log("slideup")
    var that = this
    that.setData({
      showView: false,
    })
  },
  getInputValue: function (e) {
    wx.navigateTo({
      url: '../achepai/achepai?iRentID=' + iRentID,
    })
  },
  makesure_pay: function () {
        var that = this
        that.setData({
          showView: true,
        })
    console.log(iRentID)
    console.log(rentid)
        wx.request({
          url: url + '/public/index.php/wxinterfeace/rent_order/rent_add_rent_continue', //接口地
          method: "POST",
          data: {
            "rentid": rentid,
            "accesstoken": AccessToken,
            "rentownerid": iRentID,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var query_clone = res.data;
            console.log(res.data)
            if (query_clone.Result == '1') {
              OrderNumber = query_clone.Data.OrderNumber
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
  bindPickerChange: function (e) {
    var that =this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    rentid = list[e.detail.value].RentID,
      console.log("rentid=" + rentid)
    console.log(list[e.detail.value].RentUnitPrice)
    for (var z = 0; z < that.data.return_data.length;z++){
      if (that.data.return_data[z].State == '2'){
        console.log(z)
        let showConObj = 'return_data[' + z + '].Value';
        that.setData({
          [showConObj]: list[e.detail.value].RentUnitPrice
        })
        console.log(that.data.return_data)
      }
    }
    that.setData({
      inde: e.detail.value,
      RentUnitPrice: list[e.detail.value].RentUnitPrice,
      money: list[e.detail.value].RentMoney
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
    iRentID = options.iRentID
    console.log(iRentID)
    var that = this
    console.log(url + '/public/index.php/wxinterfeace/rent_order/rent_continue_info')
    wx.request({
      url: url + '/public/index.php/wxinterfeace/rent_order/rent_continue_info', //接口地
      method: "POST",
      data:{
        "rentownerid": iRentID,
        "accesstoken": AccessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var query_clone = res.data;
        console.log(res.data)
        console.log(query_clone.Data)
        if (query_clone.Result == '1') {
          console.log(query_clone.Data.OrderList)
          rentid = query_clone.Data.InitRentID
          list = query_clone.Data.FeeRule
          for (var i = 0; i < list.length; i++) {
            back_arry[i] = list[i].RentInterval
          }
         
          that.setData({
            return_data: query_clone.Data.OrderList,
            Result: query_clone.Data,
            array: back_arry,
            show:false,
            xixi:true,
            money: query_clone.Data.PayTotalMoney,
            bottom: query_clone.Data.FeeRule
          })
          console.log(that.data.Result.PayTotalMoney)
          wx.getStorage({
            key: 'chepai',
            success: function (res) {
              for (var z = 0; z < that.data.return_data.length; z++) {
                if (that.data.return_data[z].State == '1') {
                  console.log(z)
                  var showConObj = 'return_data[' + z + '].Value';
                  that.setData({
                    [showConObj]: res.data
                  })
                  console.log(that.data.return_data)
                }
              }
              console.log("取到的车牌号=" + res.data)
            },
            fail: function (res) {
              console.log(res)

            }
          })
        } else {
          that.setData({
            xixi:false,
            message: res.data.Message,
            show:true
          })
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
  //充值支付
  save_pay: function () {
    var that = this
    that.setData({
      showView: false,
    })
    //添加订单
    console.log(OrderNumber)
    console.log(AccessToken)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/pay_order/pay_self_rent_continue_order', //接口地址
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'ordernumber': OrderNumber
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var query_clone = res.data;
        if (query_clone.Result == '1') {
          console.log(res.data.Message)
          wx.showToast({
            title: "支付成功",
            icon: 'none',
          })
          console.log(res.data.Message)
          setTimeout(function () {
            wx.reLaunch({
              url: '../car_rent/car_rent'
            })
          }, 500) 
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
  },
  //确认支付
  zhifu: function (e) {
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
      that.setData({
        showView: false,
      })
      //添加订单
      const IP = wx.getStorageSync('IP'); //本地取存储的sessionID
      console.log("IP=====" + IP)
      console.log("IP数据类型" + typeof (IP))
      wx.request({
        url: url + '/public/index.php/wxinterfeace/pay_order/pay_wx_rent_continue_order', //接口地址
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
              nonceStr: Noncestr,
              package: PrepayID,
              signType: 'MD5',
              paySign: Sign,
              success: function () {
                wx.showToast({
                  title: "支付成功",
                  icon: 'none',
                })
                console.log(res.data.Message)
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../car_rent/car_rent'
                  })
                }, 500) 

                console.log('支付成功');
                // setTimeout(function () {
                //   that.orderpayinfo(parkingid, orderid);
                //   OrderPayInfoState = OrderPayInfoState + 1;
                //   console.log("orderpayinfo" + query_clone.Data.ParkingID);
                // }, 1000);
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
        title: '请勿反复点击',
        image: '../../images/public/ic_net_error.png',
      })

    }
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