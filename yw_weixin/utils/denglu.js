
function denglu(){
  wx.login({
    success(res) {
      console.log(res.code)
      wx.setStorageSync('code', res.code)
      if (res.code) {
        //发起网络请求
        wx.request({
          url: 'http://125.67.237.92:8003/tp5/public/index.php/wxinterfeace/wechat/wx_login',
          method: 'POST',
          data: {
            'js_code': res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            // 'Content-Type': 'application/json'
          },
          success: function (res) {


            console.log(res.data)
            const code = wx.getStorageSync('code');
            console.log("code=" + code)
            wx.setStorageSync('AccessToken', res.data.Data.AccessToken)
            wx.setStorageSync('OpenID', res.data.Data.OpenID)
            console.log('登录成功！')
            console.log(res.data.Data.AccessToken)


          }

        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })


}

