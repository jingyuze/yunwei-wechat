// pages/order_list/order_list.js
const app = getApp();
var url = app.globalData.url;
var AccessToken;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    v_all_show:false,
    histry_hidden: true,
    return_current_data: null,
    return_history_data: [],
  },
  history_list:function(event) {
    var that = this;
    console.log(AccessToken)
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/order_history_info',
      method: "POST",
      data: {
        'accesstoken': AccessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        console.log(res.data);
        if (res.data.Result == 1) {
          var return_history_data = res.data.Data
          for (var i = 0; i < return_history_data.length; i++) {
            if (return_history_data[i].StateNum == 0) {
              return_history_data[i]["Color"] = "#23bfb2";
            } else if (return_history_data[i].StateNum == 1) {
              return_history_data[i]["Color"] = "#FF0000";
            } else if (return_history_data[i].StateNum == 2) {
              return_history_data[i]["Color"] = "#898989";
            } else if (return_history_data[i].StateNum == 3) {
              return_history_data[i]["Color"] = "#23bfb2";
            } else if (return_history_data[i].StateNum == 4) {
              return_history_data[i]["Color"] = "#FF0000";
            } else if (return_history_data[i].StateNum == 5) {
              return_history_data[i]["Color"] = "#FF0000";
            } else if (return_history_data[i].StateNum == 6) {
              return_history_data[i]["Color"] = "#FF0000";
            }else {
              return_history_data[i]["Color"] = "#898989";
            }
          }
          that.setData({
            return_history_data: return_history_data,
            histry_hidden: false
          });
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
        } else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '网络访问出现问题！',
          icon: "warn"
        })
      }
    })
  },
  current_details: function(event) {
    var that = this;
    var return_current_data = that.data.return_current_data;

    if (return_current_data.Type == 1) {
      wx.navigateTo({
        url: '../order_detail/order_detail?ParkingID=' + return_current_data.ParkingID + '&OrderID=' + return_current_data.OrderID,
      })
    } else if (return_current_data.Type == 2 || return_current_data.Type == 3) {
      wx.navigateTo({
        url: '../fare_payment/fare_payment'
      })
    } else if (return_current_data.Type == 5 ){
      wx.navigateTo({
        url: '../order_ payment/order_ payment?ParkingID=' + return_current_data.ParkingID + '&OrderID=' + return_current_data.OrderID
      })
    } else if (return_current_data.Type == 4) {
      wx.navigateTo({
        url: '../reserve_order_pay/reserve_order_pay?ParkingID=' + return_current_data.ParkingID + '&OrderID=' + return_current_data.OrderID
      })
    }else{

    }
  },
  history_details: function(event) {
    var that = this;

    var return_history_data = that.data.return_history_data[event.currentTarget.dataset.replyType]
    wx.navigateTo({
      url: '../order_details_history/order_details_history?ParkingID=' + return_history_data.ParkingID + '&OrderID=' + return_history_data.OrderID,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var accessToken = wx.getStorageSync('AccessToken');
    AccessToken = accessToken;
    console.log(AccessToken);
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var accessToken = wx.getStorageSync('AccessToken');
    AccessToken = accessToken;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var accessToken = wx.getStorageSync('AccessToken');
    AccessToken = accessToken;
    console.log("onShow")
    var that = this;
    wx.request({
      url: url + '/public/index.php/wxinterfeace/order/order_current_info',
      method: "POST",
      data: {
        'accesstoken': AccessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        console.log(res.data);
        if (res.data.Result == 1) {
          console.log(res.data.Data.length);
          if (res.data.Data.length == 0) {
            that.setData({
              return_current_data: null,
            });
          } else {
            var return_current_data = res.data.Data
            if (return_current_data.StateNum == 0) {
              return_current_data["Color"] = "#23bfb2";
            } else if (return_current_data.StateNum == 1) {
              return_current_data["Color"] = "#FF0000";
            } else if (return_current_data.StateNum == 2) {
              return_current_data["Color"] = "#898989";
            } else if (return_current_data.StateNum == 3) {
              return_current_data["Color"] = "#23bfb2";
            } else if (return_current_data.StateNum == 4) {
              return_current_data["Color"] = "#FF0000";
            } else if (return_current_data.StateNum == 5) {
              return_current_data["Color"] = "#FF0000";
            } else if (return_current_data.StateNum == 6) {
              return_current_data["Color"] = "#FF0000";
            } else {
              return_current_data["Color"] = "#898989";
            }
            that.setData({
              return_current_data: return_current_data,
            });
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
        }else {
          wx.showToast({
            title: res.data.Message,
            icon: "none"
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          image: '../../images/public/ic_net_error.png',
        })
      },complete(){
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