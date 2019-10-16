const app = getApp()
var url = app.globalData.url
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const wxMap = new QQMapWX({
  key: 'AJMBZ-5QZ6S-LBQOH-6I7HB-DLRNF-X6BCY' // 必填
});
var slef_asseccToken, deviceNumber, orderType;
Page({
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reverseGeocoder()
    var that = this;
    deviceNumber = options.DeviceNumber;
    orderType = options.OrderType;
    console.log("orderType:" + orderType);
    console.log("deviceNumber:" + deviceNumber);

    /*
     *通过loginState存储值判断是否过期，当每次其他接口返回2000时，需要重新置原loginState和accessToken
     *无论微信那边检测是否过期，都应重制accessToken
     */
    var loginState = wx.getStorageSync('LoginState');
    console.log("loginState:" + loginState);
    if (!loginState) {
      wx.checkSession({
        success(res) {
          //session_key 未过期，并且在本生命周期一直有效
          console.log("session_key 未过期，并且在本生命周期一直有效")
          wx.login({
            success(res) {
              console.log(res.code)
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: url+'/public/index.php/wxinterfeace/wechat/wx_login',
                  method: 'POST',
                  data: {
                    'js_code': res.code
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  success: function(res) {
                    console.log("authorization-wx_login:" + res.data)
                    if (res.data.Result == '1') {
                      slef_asseccToken = res.data.Data.AccessToken
                      console.log("AccessToken=" + slef_asseccToken)
                      wx.setStorageSync('OpenID', res.data.Data.OpenID)
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
                  }

                })
              } else {
                wx.showToast({
                  title: '登录失败',
                  image: '../../images/public/ic_error.png',
                })
              }
            }
          })


        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login({
            success(res) {
              console.log(res.code)
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: url+'/public/index.php/wxinterfeace/wechat/wx_login',
                  method: 'POST',
                  data: {
                    'js_code': res.code
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  success: function(res) {
                    console.log("authorization-wx_login:" + res.data)
                    if (res.data.Result == '1') {
                      slef_asseccToken = res.data.Data.AccessToken
                      console.log("AccessToken=" + slef_asseccToken)
                      wx.setStorageSync('OpenID', res.data.Data.OpenID)
                    
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
                  }

                })
              } else {
                wx.showToast({
                  title: '登录失败！',
                  image: '../../images/public/ic_error.png',
                })
              }
            }
          })
        }
      })

    } else {
      var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
      AccessToken = accessToken;
      var that = this
      //登录日志添加
      wx.request({
        url: url + '/public/index.php/wxinterfeace/login/login_log', //接口地
        method: "POST",
        data: {
          'accesstoken': AccessToken,
          'devicetype': '3'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var query_clone = res.data;
          if (query_clone.Result == '1') {
            console.log(res.data.Message)
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
    //检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {//如果有新版本

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启应用',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                wx.getUpdateManager().applyUpdate();
              }
            }
          })

        })

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function () {//当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    });
  },
 
  //通过绑定手机号登录
  getPhoneNumber: function(e) {
    console.log(e.detail.errMsg)
    if (!e.detail.encryptedData) {
      wx.showModal({
        content: '为了您有更好的体验，小程序需要您的微信授权',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {

          }
        }
      });
    }
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData
    console.log("iv=====" + ivObj)
    console.log("encryptedData======" + telObj)
    var codeObj = "";
    var that = this;
    console.log("accessToken=====" + slef_asseccToken)
    var accessToken = slef_asseccToken; //本地取存储的sessionID
    wx.request({
      url: url + '/public/index.php/wxinterfeace/user_w_x_data/user_wx_data', //接口地址
      method: "POST",
      data: {
        'encrypteddata': telObj,
        'iv': ivObj,
        'accesstoken': accessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        console.log("user_wx_data:" + res.data)
        if (res.data.Result == '1') {
          var jsonObj = JSON.parse(res.data.Data);
          
          //-----------------是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面
          if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
            console.log("用户点击拒绝")
            wx.showToast({
              title: '为了您有更好的体验，小程序需要您的微信授权',
              icon: 'success',
              duration: 2000
            })
          } else { //授权通过执行跳转

            const phoneObj = jsonObj.phoneNumber;
            const address = wx.getStorageSync('address');
            //用户信息录入
            wx.request({
              url: url + '/public/index.php/wxinterfeace/user/check_register', //接口地址
              method: "POST",
              data: {
                'accesstoken': accessToken,
                'phonenumber': phoneObj,
                'address': address
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: function(res) {
                console.log("check_register:" + res.data.Data.LoginState);
                if (res.data.Result == '1') {
                  var that = this
                  wx.request({
                    url: url + '/public/index.php/wxinterfeace/login/login_log', //接口地
                    method: "POST",
                    data: {
                      'accesstoken': accessToken,
                      'devicetype': '3'
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      var query_clone = res.data;
                      if (query_clone.Result == '1') {
                        console.log(res.data.Message)
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
                    complete: function () {
                    
                    }
                  })
                  wx.setStorage({ //存储数据并准备发送给下一页使用
                    key: "AccessToken",
                    data: accessToken,
                    success: function (res) {
                      console.log('AccessTokenSuccessSet', res)
                    },
                    fail: function (err) {
                      console.log('AccessTokenFailSet', err)
                    }

                  })
        
                  wx.setStorage({ //存储数据并准备发送给下一页使用
                    key: "LoginState",
                    data: res.data.Data.LoginState,
                    success: function (res) {
                      console.log('SuccessSet', res)
                    },
                    fail: function (err) {
                      console.log('FailSet', err)
                    }

                  })
                  //根据不同场景跳转页面
              
                  if (orderType == 2) {
                    console.log("扫码进入车牌")
                    wx.redirectTo({
                      url: '../chepai/chepai?OrderType=' + orderType + "&DeviceNumber=" + deviceNumber
                    })

                  } else if (orderType == 1){
                    console.log("扫码进入地图主页")
                    wx.redirectTo({
                      url: '../map/map',
                    })
                  }else{
                    console.log("扫码进入地图主页")
                    wx.redirectTo({
                      url: '../map/map',
                    })
                  }
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 1000
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
              complete: function(res) {


              }
            })
          }
        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
          })

        }
      }, fail: function(res){
        wx.showToast({
          title: '请求失败',
          image: '../../images/public/ic_net_error.png',
        })
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
  reverseGeocoder() {
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wxMap.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            const city = res.result.address_component
            console.log(city);
            const addres = res.result.address_component.province + res.result.address_component.city + res.result.address_component.district + res.result.address_component.street + res.result.address_component.street_number
            console.log(addres)
            var address = addres.toString();
            app.globalData.startsite = address
            console.log(address)
            wx.setStorageSync('address', address)
            console.log(typeof(address))

          },
        });
      },
      fail(res) {
        wx.showModal({
          content: '位置获取失败，可能会导致部分功能不能正常使用，如需正常使用，请允许权限',
          showCancel: false,
          confirmText:"授权",
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  console.log('授权成功')
                }
              })
            }
          }
        });
      }
    })
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