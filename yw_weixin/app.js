//app.js
App({
  onLaunch: function(options) {
    console.log(options)
    var scene = decodeURIComponent(options.scene);
    console.log("scene is ", scene);
    //场景值
    var obj = wx.getLaunchOptionsSync()
    console.log('启动小程序的路径:', obj.path)
    console.log('启动小程序的场景值:', obj.scene)
    wx.setStorageSync('Scene_value', obj.scene)
    console.log('启动小程序的 query 参数:', obj.query.devicenumber)
    console.log('来源信息:', obj.shareTicket)
    console.log('来源信息参数appId:', obj.referrerInfo.appId)
    console.log('来源信息传过来的数据:', obj.referrerInfo.extraData)
    //获取用户本机IP
    wx.request({
      url: 'https://pv.sohu.com/cityjson?ie=utf-8',
      success: function(e) {
        console.log(e.data);
        var aaa = e.data.split(' ');
        console.log(aaa)
        var bbb = aaa[4]
        console.log(bbb)
        var ccc = bbb.replace('"', '')
        console.log(ccc)
        var ddd = ccc.replace('"', '')
        console.log(ddd)
        var eee = ddd.replace(',', '')
        console.log(eee)
        wx.setStorageSync('IP', eee)
      },
      fail: function() {
        console.log("失败了");
      }
    })
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
    /**
//  * 初次加载判断网络情况
//  * 无网络状态下根据实际情况进行调整
//  */
//     wx.getNetworkType({
//       success(res) {
//         const networkType = res.networkType
//         if (networkType === 'none') {
//           that.globalData.isConnected = false
//           wx.showToast({
//             title: '当前无网络',
//             icon: 'loading',
//             duration: 2000
//           })
//         }
//       }
//     });
//     /**
//      * 监听网络状态变化
//      * 可根据业务需求进行调整
//      */
//     wx.onNetworkStatusChange(function (res) {
//       if (!res.isConnected) {
//         that.globalData.isConnected = false
//         wx.showToast({
//           title: '网络已断开',
//           icon: 'loading',
//           duration: 2000,
//           complete: function () {
//             that.goStartIndexPage()
//           }
//         })
//       } else {
//         that.globalData.isConnected = true
//         wx.hideToast()
//       }
//     });
  },
  globalData: {
    url: "https://www.yunweixinxi.com/tp5test",
    startsite: '',
    isConnected: true,
    userid:'',
    parkingid: ''
  },
})