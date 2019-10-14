var app = getApp()

Page({
  

  showok: function() {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
  },
  onLoad: function (options) {
   
  },
  
  data: {
    isSubmit: false,
    input_bottom: 0,
    imgUrls: [{
        link: "",
        url: '/images/lunbo_1.png'
      }, {
        link: "",
        url: '/images/lunbo_2.png'
      }, {
        link: "",
        url: '/images/lunbo_3.jpg'
      }

    ],

 

    a: ["xixi", "xixixi", "xixixxixixxixixx"],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1300,
    bg: '#C79C77',
    Height: ""

  },
  
  imgHeight: function(e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度 
    var imgh = e.detail.height; //图片高度  
    var imgw = e.detail.width; //图片宽度  
    var swiperH = winWid * imgh / imgw + "px" //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度 
    this.setData({
      Height: swiperH
    })
  },
  
  // 获取到焦点
  focus: function (e) {
    this.setData({
      input_bottom: 100
    })
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
  },
  // 失去焦点
  no_focus: function (e) {
    this.setData({
      input_bottom: 0
    })
  },

  formSubmit: function(e) {
   
    let {
      username,
      password
    } = e.detail.value;
    if (!username && !password) {
      wx.showToast({
        title: '请输入正确编码',
        icon: 'loading',
        duration: 1000
      })

    } else if (!username) {
      wx.showToast({
        title: '停车场编码为空',
        icon: 'loading',
        duration: 1000
      })
      this.setData({
        warn: "账号或密码为空！",
        isSubmit: true
      })
    } else if (!password) {
      wx.showToast({
        title: '授权码为空',
        icon: 'loading',
        duration: 1000
      })
      this.setData({
        warn: "账号或密码为空！",
        isSubmit: true
      })
    } else { 
       
      console.log('https://www.yunweixinxi.com/android_parking/logincheck.php?username=' + username + '&password=' + password)
      var that = this;
      wx.request({
        url: 'https://www.yunweixinxi.com/android_parking/logincheck.php?username=' + username + '&password=' + password,
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        //请求后台数据成功
        
        
        success: function(res) {

          
          //console.log('返回的code' + res.data)
          var query_clone = JSON.parse(JSON.stringify(res.data));
          //console.log('返回的userid' + query_clone.userid)
          //console.log('返回的result' + query_clone.result)
          if (query_clone.Result == '1') {
     
            app.globalData.OpenState = query_clone.Data.OpenState
            app.globalData.userid = query_clone.Data.UserID
            app.globalData.ParkingID = query_clone.Data.ParkingID
            var orderInfo = e.detail.value;
            console.log("openstate" +query_clone.Data.OpenState);
            var user = query_clone.Data.UserID
            console.log(user+"success");
            console.log(app.globalData.ParkingID);
            console.log(orderInfo);
            wx.setStorage({
              key: 'orderInfo',
              data: orderInfo,
            })
            wx.setStorage({
              key: 'use',
              data: user,
            })
     
            wx.showToast({
              title: '验证正确',
              icon: 'success',
              duration: 1000
            })
            if (query_clone.Data.AllowReserve == '1') {

              setTimeout(() => {
                wx.redirectTo({
                  url: '../index/index',
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                })

              }, 1000)


            } else if (query_clone.Data.AllowReserve == '0') {
              // setTimeout(() => {
              //   wx.navigateTo({
              //     url: '../index/index',
              //     success: function (e) {
              //       var page = getCurrentPages().pop();
              //       if (page == undefined || page == null) return;
              //       page.onLoad();
              //     }
              //   })

              // }, 2000)

            }

 } else if (query_clone.Result == '0') {

            wx.showToast({
              title: '没有该用户信息',
              icon: 'loading',
              duration: 2000
            })
          }else if (query_clone.Result == '2') {

            wx.showToast({
              title: '用户授权已过期',
              icon: 'loading',
              duration: 2000
            })
          } else if (query_clone.Result == '3') {

            wx.showToast({
              title: '账号或密码错误',
              icon: 'loading',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '登录失败',
              icon: 'loading',
              duration: 2000
            })
          }
          
        }
      })
    }
  }
})