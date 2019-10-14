// pages/feedback/feedback.js
const app = getApp();
var url = app.globalData.url;
var AccessToken ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ceshi: ''
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  bindFormSubmit: function (e) {
    console.log(e.detail.value.textarea);
    var feedback = e.detail.value.textarea;
    console.log(feedback)
    if (e.detail.value.textarea){
    wx.request({
      url: url + '/public/index.php/wxinterfeace/feed_back/app_feed_back', //接口地
      method: "POST",
      data: {
        'accesstoken': AccessToken,
        'feedback': feedback
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.Result == '1') {
          wx.showModal({
            content: res.data.Message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              }
            }
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
          wx.navigateTo({
            url: '../authorization/authorization',
          })
          wx.showToast({
            title: res.data.Message,
            icon: 'warn',
          })
        } else {
          wx.showModal({
            content: res.data.Message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              }
            }
          });

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
  }else{
      wx.showModal({
        content: '内容不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          }
        }
      });
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var accessToken = wx.getStorageSync('AccessToken'); //本地取存储
    AccessToken = accessToken;
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