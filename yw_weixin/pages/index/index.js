//index.js
//获取应用实例
const app = getApp()
var Parking_Name=''
var LotMap
var UR=''
var parkingid

Page({
  data: {
    clickFlag: false,
  },
  //右上角分享功能
  onShareAppMessage: function (res) {
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
  },

  onLoad: function () {
    var that = this;
    var user = wx.getStorageSync('use')
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/getparkinginfo.php?userid=' + user +'&floorflag=' + 1,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
        var query_clone = JSON.parse(JSON.stringify(res.data));
        console.log('停车场名字'+query_clone.Data.ParkingName)   
        
        console.log('userID是' + user)
        if (query_clone.Result == '1'){
          that.setData({
           
            isSubmit: true,
            loadText: '点击查看下一页'
          })
            LotMap = query_clone.Data.LotMap,
              console.log(LotMap)
            parkingid = query_clone.Data.ParkingID,
              console.log('parkingid' + parkingid)

          app.globalData.parkingid = query_clone.Data.ParkingID

          const user = wx.getStorageSync('use')

          app.globalData.userid = user
          const d = encodeURIComponent()
              that.setData({
                UR: 'https://www.yunweixinxi.com/weixin_parkingowner/' + LotMap + '?userid=' + user + '&parkingid=' + parkingid + '&floorflag=1#wechat_redirect'
              })  
        }
       
        console.log(LotMap)
      }
    })
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
  //页面卸载时触发
  onHide(){
    // wx.showToast({
    //   title: '退出',
    //   icon: 'loading',
    //   duration: 1000
    // })

  },
  onUnload(){
    // wx.showToast({
    //   title: '卸载',
    //   icon: 'loading',
    //   duration: 2000
    // })
  },
          //将计时器赋值给setInter
  handleGetMessage: function (e) {
    console.log(e.target.data)
  },
  list: function () {
    console.log('onBtnClick');
    wx.navigateTo({
      url: '../list/list',
    })
   
  },
})
