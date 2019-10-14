const app = getApp()
var url = app.globalData.url
var InstallState = false
var n, parkingid, parkinglotid, orderType, devicenumber = ''
var shuzu = []
var orderType; //该参数是为了判定直接开锁还是预订，以便页面转跳1预订2开锁
Page({
  data: {
    isKeyboard: !1,
    isNumberKB: !1,
    chepaipai: '',
    tapNum: !1,
    disableKey: "1234567890港澳学",
    keyboardNumber: "1234567890ABCDEFGHJKLMNPQRSTUVWXYZ港澳学",
    keyboard1: "京沪粤津冀晋蒙辽吉黑苏浙皖闽赣鲁豫鄂湘桂琼渝川贵云藏陕甘青宁新",
    inputPlates: {
      index0: "",
      index1: "",
      index2: "",
      index3: "",
      index4: "",
      index5: "",
      index6: "",
      index7: ""
    },
    inputOnFocusIndex: "",
    flag: true,
    chepai: "新能源车牌"
  },
  onLoad: function(query) {
    var that =this
    wx.getStorage({
      key: 'chepai',
      success: function (res) {
        console.log("取到的车牌号=" + res.data)
        n = res.data.split(""); //字符分割

        that.setData({
          'inputPlates.index0': n[0],
          'inputPlates.index1': n[1],
          'inputPlates.index2': n[2],
          'inputPlates.index3': n[3],
          'inputPlates.index4': n[4],
          'inputPlates.index5': n[5],
          'inputPlates.index6': n[6],
          'inputPlates.index7': n[7]
        });
        if (n.length == 7) {
          console.log("进入7位")
        } else if (n.length == 8) {
          console.log("进入8位")
        }
        if (n.length == 7) {
          console.log("进入7位")
          that.setData({
            flag: true,
            chepai: "新能源车牌"
          })
          n = that.data.inputPlates.index0 + that.data.inputPlates.index1 + that.data.inputPlates.index2 + that.data.inputPlates.index3 + that.data.inputPlates.index4 + that.data.inputPlates.index5 + that.data.inputPlates.index6
        } else if (n.length == 8) {
          console.log("进入8位")
          that.setData({
            flag: false,
            chepai: "传统车牌"
          })
          n = that.data.inputPlates.index0 + that.data.inputPlates.index1 + that.data.inputPlates.index2 + that.data.inputPlates.index3 + that.data.inputPlates.index4 + that.data.inputPlates.index5 + that.data.inputPlates.index6 + that.data.inputPlates.index7
        }

        console.log('车牌号:', n)
      },
    })

    orderType = query.OrderType
    devicenumber = query.DeviceNumber
    console.log(devicenumber)

    var that = this;
    var loginState = wx.getStorageSync('LoginState');
    if (!loginState) {
      wx.redirectTo({
        url: '../authorization/authorization?OrderType=' + orderType + 'DeviceNumber=' + devicenumber
      })
    } else {

      var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
      console.log("devicenumber=====" + devicenumber)
      console.log("accessToken=====" + accessToken)
      wx.request({
        url: url + '/public/index.php/wxinterfeace/order/check_scan_code_order', //接口地址
        method: "POST",
        data: {
          'accesstoken': accessToken,
          'devicenumber': devicenumber
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          console.log(res.data)
          var parkingID = res.data.Data.ParkingID;
          var orderID = res.data.Data.OrderID;
          if (res.data.Result == '1') {
            parkingid = res.data.Data.ParkingID
            parkinglotid = res.data.Data.LotID
            const MsgContent = res.data.Data.MsgContent
            console.log("chepai:" + res.data.Data.Code)
            if (res.data.Data.Code == '1') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.redirectTo({
                      url: '../order_ payment/order_ payment?ParkingID=' + parkingID + "&OrderID=" + orderID
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.reLaunch({
                      url: '../map/map',
                    })
                  }
                }
              })

            
            } else if (res.data.Data.Code == '2') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.redirectTo({
                      url: '../order_detail/order_detail?ParkingID=' + parkingID + "&OrderID=" + orderID,
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.reLaunch({
                      url: '../map/map',
                    })
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
                    wx.redirectTo({
                      url: '../occupied/occupied?ParkingID=' + parkingID + "&OrderID=" + orderID,
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.reLaunch({
                      url: '../map/map',
                    })
                  }
                }
              })
          
            } else if (res.data.Data.Code == '6' || res.data.Data.Code == '7' || res.data.Data.Code == '8') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.redirectTo({
                      url: '../fare_payment/fare_payment',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.reLaunch({
                      url: '../map/map',
                    })
                  }
                }
              })
              
            } else if (res.data.Data.Code == '10') {
              wx.showModal({
                content: MsgContent,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.redirectTo({
                      url: '../reserve_order_pay/reserve_order_pay?ParkingID=' + parkingid + "&OrderID=" + orderID,
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.reLaunch({
                      url: '../map/map',
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

        complete: function() {


        }
      })
    }
  },
  //切换车牌
  changeplate: function(event) {
    var that = this;
    InstallState = event.currentTarget.dataset.replyType;
    console.log(InstallState)
    if (InstallState == true) {
      that.setData({
        flag: !that.data.flag,
        chepai: "传统车牌"
      })
      that.setData({
        inputPlates: {
          index0: "",
          index1: "",
          index2: "",
          index3: "",
          index4: "",
          index5: "",
          index6: "",
          index7: ""
        },
      })


    } else if (InstallState == false) {
      that.setData({
        chepai: "新能源车牌"
      })
      that.setData({
        flag: !this.data.flag,
        inputPlates: {
          index0: "",
          index1: "",
          index2: "",
          index3: "",
          index4: "",
          index5: "",
          index6: "",
          index7: ""
        },
      })
    }
  
  },

  inputClick: function(t) {
    var that = this;
    console.log('输入框:', t)
    that.setData({
      inputOnFocusIndex: t.target.dataset.id,
      isKeyboard: !0
    })
    "0" == this.data.inputOnFocusIndex ? that.setData({
      tapNum: !1,
      isNumberKB: !1
    }) : "1" == this.data.inputOnFocusIndex ? that.setData({
      tapNum: !1,
      isNumberKB: !0
    }) : that.setData({
      tapNum: !0,
      isNumberKB: !0
    });
    if (InstallState == false) {
      n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6
    } else {
      n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6 + this.data.inputPlates.index7
    }
    console.log('车牌号:', n)
    n = n.trim().replace(/\s/g, "")
    console.log("点击Input="+n)
  },

  //键盘点击事件
  tapKeyboard: function(t) {
    t.target.dataset.index;
    var a = t.target.dataset.val;
    console.log('键盘:', a)
    switch (this.data.inputOnFocusIndex) {
      case "0":
        this.setData({
          "inputPlates.index0": a,
          inputOnFocusIndex: "1"
        });
        break;

      case "1":
        this.setData({
          "inputPlates.index1": a,
          inputOnFocusIndex: "2"
        });
        break;

      case "2":
        this.setData({
          "inputPlates.index2": a,
          inputOnFocusIndex: "3"
        });
        break;

      case "3":
        this.setData({
          "inputPlates.index3": a,
          inputOnFocusIndex: "4"
        });
        break;

      case "4":
        this.setData({
          "inputPlates.index4": a,
          inputOnFocusIndex: "5"
        });
        break;

      case "5":
        this.setData({
          "inputPlates.index5": a,
          inputOnFocusIndex: "6"
        });
        break;

      case "6":
        this.setData({
          "inputPlates.index6": a,
          inputOnFocusIndex: "7"
        });
        break;

      case "7":
        this.setData({
          "inputPlates.index7": a,
          inputOnFocusIndex: "7"
        });
    }
    if (InstallState == false) {
      n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6
    } else {
      n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6 + this.data.inputPlates.index7
    }

    console.log('车牌号:', n)
    this.checkedSubmitButtonEnabled();
  },
  //键盘关闭按钮点击事件
  tapSpecBtn: function(t) {
    var a = this,
      e = t.target.dataset.index;
      console.log("当前点击的索引值"+e)
      console.log()
    console.log(t);
    if (0 == e) {
      switch (parseInt(this.data.inputOnFocusIndex)) {
        case 0:
          this.setData({
            "inputPlates.index0": "",
            inputOnFocusIndex: "0"
          });
          break;

        case 1:
          this.setData({
            "inputPlates.index1": "",
            inputOnFocusIndex: "0"
          });
          break;

        case 2:
          this.setData({
            "inputPlates.index2": "",
            inputOnFocusIndex: "1"
          });
          break;

        case 3:
          this.setData({
            "inputPlates.index3": "",
            inputOnFocusIndex: "2"
          });
          break;

        case 4:
          this.setData({
            "inputPlates.index4": "",
            inputOnFocusIndex: "3"
          });
          break;

        case 5:
          this.setData({
            "inputPlates.index5": "",
            inputOnFocusIndex: "4"
          });
          break;

        case 6:
          this.setData({
            "inputPlates.index6": "",
            inputOnFocusIndex: "5"
          });
          break;

        case 7:
          this.setData({
            "inputPlates.index7": "",
            inputOnFocusIndex: "6"
          });
      }
      this.checkedSubmitButtonEnabled();
      if (InstallState == false) {
        n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6
      } else {
        n = this.data.inputPlates.index0 + this.data.inputPlates.index1 + this.data.inputPlates.index2 + this.data.inputPlates.index3 + this.data.inputPlates.index4 + this.data.inputPlates.index5 + this.data.inputPlates.index6 + this.data.inputPlates.index7
      }
      console.log("删除的n="+n)
    } else 1 == e && a.setData({
      isKeyboard: !1,
      isNumberKB: !1,
      inputOnFocusIndex: ""
    });
  },
  //键盘切换
  checkedKeyboard: function() {
    var t = this;
    "0" == this.data.inputOnFocusIndex ? t.setData({
      tapNum: !1,
      isNumberKB: !1
    }) : "1" == this.data.inputOnFocusIndex ? t.setData({
      tapNum: !1,
      isNumberKB: !0
    }) : this.data.inputOnFocusIndex.length > 0 && t.setData({
      tapNum: !0,
      isNumberKB: !0
    });
  },


  numbe: function() {
    var that = this
    console.log(n)
    if (n != undefined) {
      if (InstallState) {
        if (n.length != 8) {
          wx.showToast({
            title: '请输入8位车牌号',
            icon: 'none',
            duration: 1000
          })
          return false;
        }

      } else {
        if (n.length != 7) {
          wx.showToast({
            title: '请输入7位车牌号',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
      }
      wx.setStorage({
        key: 'chepai',
        data: n,
      })
      console.log("n的数据类型" + typeof(n))
      // wx.setStorageSync('chepaihao', this.data.arr2);
      // wx.getStorage({
      //   key: 'chepaihao',
      //   success: function(res) {
      //     //输出缓存内容
      //     console.log(res.data)
      //   }
      // })

      var accessToken = wx.getStorageSync('AccessToken'); //本地取存储的sessionID
      console.log("accessToken=====" + accessToken)
      console.log("添加订单车牌号" + n)
      const startsite = app.globalData.startsite
      console.log("预订地点startsite=" + startsite)
      console.log("添加订单停车场编号=" + parkingid)
      console.log("添加订单车位号=" + parkinglotid)
      console.log("添加订单orderType=" + orderType)
      wx.request({
        url: url + '/public/index.php/wxinterfeace/order/add_occupy_order', //接口地址
        method: "POST",
        data: {
          'accesstoken': accessToken,
          'platenumber': n,
          'parkingid': parkingid,
          'parkinglotid': parkinglotid,
          'startsite': startsite,
          'ordertype': orderType
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          console.log(res.data)

          console.log("ParkingID=" + res.data.Data.ParkingID)
          console.log("OrderID=" + res.data.Data.OrderID)
          if (res.data.Result == '1') {
            if (res.data.Data.OrderType == "0") {
              wx.redirectTo({
                url: '../reserve_order_pay/reserve_order_pay?ParkingID=' + res.data.Data.ParkingID + '&OrderID=' + res.data.Data.OrderID + '&parkinglotid=' + parkinglotid,
              })
            } else {
              wx.redirectTo({
                url: '../order_ payment/order_ payment?ParkingID=' + res.data.Data.ParkingID + '&OrderID=' + res.data.Data.OrderID + '&parkinglotid=' + parkinglotid,
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
            wx.redirectTo({
              url: '../authorization/authorization',
            })
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
            })
          }else{
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '订单检查失败',
            icon: 'success',
            duration: 1000
          })
        },
      })
    } else {
      wx.showModal({
        content: '请输入车牌号',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {

          }
        }
      });

    }

  },
  checkedSubmitButtonEnabled: function() {
    this.checkedKeyboard();
    var t = !0;
    for (var a in this.data.inputPlates)
      if ("index7" != a && this.data.inputPlates[a].length < 1) {
        t = !1;
        break;
      }
  },
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