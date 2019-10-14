//index.js
//获取应用实例
const app = getApp()
var Parking_Name = ''
var LotMap
var UR = ''
var z, zz, user, parkingid, ids, obj, array, arrays, len, arrr, scene
var project=''
var tiaozhuan=''
var pops=''
var floorflag=0
var InstallState=''
var yuze=0
var check=0
Page({
  data: {
    name: '',
    showView: false,
   xixi:true,
   car:0,
    id:0
  },
  cnge:function(){
return false;
  },
  
 
  ch:function(event){
    
    return false;
  },

  //页面加载接收传参以及类目的初始化
  onLoad: function (options) {
    if (options.scene) {
      scene = decodeURIComponent(options.scene)
      console.log('启动小程序的场景值:', scene)
      devicenumber = scene.substr(-9, 8)
      OrderType = scene.substr(-1, 1)
      console.log("OrderType=" + OrderType)
      console.log("devicenumber=" + devicenumber)
      if (options.scene) {
        wx.navigateTo({
          url: '../chepai/chepai?DeviceNumber=' + devicenumber + '&OrderType=' + OrderType
        })
      }
    } else {
      console.log("没有scene")
    }
    console.log("000000000000000000000000000000000000000000000000");
     user=app.globalData.userid
        z= options.openstate
    zz = options.stylestate
    parkingid = app.globalData.parkingid
   
   console.log("传递的参数openstate为"+z)
    console.log("传递的参数stylestate为" + zz)
    console.log("传递的参数userid为" + user)
    console.log("传递的参数parkingid为" + parkingid)
    var that = this;
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/gettitleinfo.php?userid=' + user + '&openstate=' + z + '&parkingid=' + parkingid + '&stylestate=' + zz,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
      
        var query_clone = JSON.parse(JSON.stringify(res.data));
        
        if (query_clone.Result == '1') {
      
          //有数据返回来数据列表渲染出来，没有出现空图
          if (query_clone.Data.length > 0) {
            console.log("返回数据的长度为" + query_clone.Data.length)
            that.setData({
              button: query_clone.Data,
              // isSubmit: true,
              xixi: true,
            })

          }else{
            wx.showToast({
              title: '无数据',
              icon: 'success',
              duration: 1000
            })
          }

        } else if (query_clone.Result == '0') {
          wx.showToast({
            title: '错误',
            icon: 'success',
            duration: 1000
          })
        }
       
        
      }
    })

 //初始化页面

   InstallState = 0;
    console.log("得到当前点击的元素为" + InstallState)
    var that = this;
    if (z == '2' || z == '0' || z == '1') {
      if (zz=='0'){

      that.setData({
        name: "车位解锁"
      })
      }
      if (zz == '1') {
        console.log("传递的参数openstate为haahahaahhahahaahahahh")
        that.setData({
          name: "占用上锁"
        })
      }
    } 
    console.log("传递的参数openstate为" + z)
    console.log("传递的参数stylestate为" + zz)
    console.log("传递的参数userid为" + user)
    console.log("传递的参数parkingid为" + parkingid)
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/controllotlist.php?userid=' + user + '&floorflag=' + 0 + '&parkingid=' + parkingid + '&type=' + InstallState + '&openstate=' + z + '&stylestate=' + zz,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
        
        var query_clone = JSON.parse(JSON.stringify(res.data));
        if (query_clone.Result == '1') {
          if (query_clone.Data.length > 0) {
            that.setData({
              project: query_clone.Data,
              xixi: true,
            })

          }

        } else {
          that.setData({
            project: '',
            xixi: false,

          })

        }
        
      }
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    console.log("刷新了");
    var that = this;
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/controllotlist.php?userid=' + user + '&floorflag=' + 0 + '&parkingid=' + parkingid + '&type=' + InstallState + '&openstate=' + z + '&stylestate=' + zz,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {

        var query_clone = JSON.parse(JSON.stringify(res.data));
        if (query_clone.Result == '1') {
          if (query_clone.Data.length > 0) {
            that.setData({
              project: query_clone.Data,
              xixi: true,
            })

          }

        } else {
          that.setData({
            project: '',
            xixi: false,

          })

        }

      },
       complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新

      },
    })
  },
  //初始化页面
  onShow: function () {
    console.log("进onshow里面了");
    
    console.log("得到当前点击的元素为" + InstallState)
    var that = this;
    console.log("传递的参数openstate为" + z)
    console.log("传递的参数stylestate为" + zz)
    console.log("传递的参数userid为" + user)
    console.log("传递的参数parkingid为" + parkingid)
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/controllotlist.php?userid=' + user + '&floorflag=' + 0 + '&parkingid=' + parkingid + '&type=' + InstallState + '&openstate=' + z + '&stylestate=' + zz,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
        
        var query_clone = JSON.parse(JSON.stringify(res.data));
        if (query_clone.Result == '1') {
          if (query_clone.Data.length > 0) {
            that.setData({
              project: query_clone.Data,
              xixi: true,
            })

          }

        } else {
          that.setData({
            project: '',
            xixi: false,

          })

        }

      }
    })
  },
 
  //点击顶部按钮选择车层
  choice:function(){
  
      var that = this;
      console.log("选择车层")
      
    
console.log("点击顶部按钮选择图层")
 
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/getfloorinfo.php?parkingid=' + parkingid,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
    
        var query_clone = JSON.parse(JSON.stringify(res.data));
        floorflag = query_clone.Data[0].FloorFlag
        if (query_clone.Result == '1') {
          if (query_clone.Data.length > 0) {    
            floorflag = query_clone.Data[0].FloorFlag
            console.log(query_clone.Data[0].Floor)
            console.log(query_clone.Data[0].FloorFlag)
            that.setData({
              showView: (!that.data.showView),
              dimian: query_clone.Data
            })
          }

        } else if (query_clone.Result == '0'){
          wx.showToast({
            title: '无数据',
            icon: 'success',
            duration: 1000
          })

        }
        
      }
    })

  },
  //post提交数据
  checkboxChange: function (e) {
    if (e.detail.value == '') {
      check = 0
    }
    else {
      check = 1
    }
    const that = this;
    pops = e.detail.value;
    
    console.log(typeof pops)
    len = pops.length,
    //得到车位列表左下角的车位个数
    
      that.setData({

      car: len,

      })
    console.log(len)
      array = [];
    for (var i=0; i < len; i++) {
      array.push({ "id": pops[i]});
    }
    arrays=[];
    arrays.push({ "ids": array});

      //把获取的自定义id赋给当前组件的id(即获取当前组件)
    arrr = JSON.stringify(array);
    arrr = "{"+"\"ids\":" +arrr+"}";
    console.log(arrr)
  },
  //提交数据
  postpost: function () {
    var that = this;
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/controllotids.php',
      method: "POST",
      data: {
        ids: arrr,
        userid: user,
        parkingid: parkingid,
        type: InstallState,
        stylestate:zz,
        openstate:z
      },
      
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
        console.log("显示的TYPE是"+InstallState)
        var query_clone = JSON.parse(JSON.stringify(res.data));
        if (query_clone.Result == '1') {
         
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
          wx.request({
            url: 'https://www.yunweixinxi.com/android_parking/controllotlist.php?userid=' + user + '&floorflag=' + 0 + '&parkingid=' + parkingid + '&type=' + InstallState + '&openstate=' + z + '&stylestate=' + zz,
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            
            //请求后台数据成功 
            success: function (res) {
      console.log("进入重载页面里面")
              var query_clone = JSON.parse(JSON.stringify(res.data));
              if (query_clone.Result == '1') {
                if (query_clone.Data.length > 0) {
                  that.setData({
                    project: query_clone.Data,
                    xixi: true,
                  })

                }

              } else {
                that.setData({
                  project: '',
                  xixi: false,
                   
                })

              }

            }
          })

        

        } else {
          console.log(query_clone.Result)
          wx.showToast({
            title: '提交失败',
            icon: 'success',
            duration: 1000
          })

        }

      }
    })
  },
  //点击类目
  Title: function (event) {
    //得到当前点击的元素
    var ids = event.currentTarget.dataset.id;
    console.log(ids)
    this.setData({
      id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
      car:0
    })
    console.log(ids)
    InstallState = event.currentTarget.dataset.replyType
    console.log(InstallState)
    var that = this;
    if (z == '2' || z == '0' || z == '1'){
      if (zz == '0'){
    if (InstallState==0){
      that.setData({
        name:"车位解锁"

      })

    } else if (InstallState == 1){
      that.setData({
        name: "恢复上锁"

      })

    } else if (InstallState == 2){

      that.setData({
        name: "故障上报"

      })
    }
      } else if (zz == '1'){
       
        if (InstallState == 0) {
          that.setData({
            name: "占用上锁"

          })

        } else if (InstallState == 1) {
          that.setData({
            name: "车位解锁"

          })

        } else if (InstallState == 2) {

          that.setData({
            name: "无法操作"

          })
        } else if (InstallState == 3) {

          that.setData({
            name: "恢复上锁"

          })
        } else if (InstallState == 4) {

          that.setData({
            name: "故障上报"

          })
        }

      }
  }
    
    console.log("得到当前点击的元素为" + InstallState)
    var that = this;
    console.log("传递的参数openstate为" + z)
    console.log("传递的参数stylestate为" + zz)
    console.log("传递的参数userid为" + user)
    console.log("传递的参数parkingid为" + parkingid)
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/controllotlist.php?userid=' + user + '&floorflag=' + 0 + '&parkingid=' + parkingid + '&type=' + InstallState + '&openstate=' + z + '&stylestate=' + zz,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
        
        var query_clone = JSON.parse(JSON.stringify(res.data));
        if (query_clone.Result == '1') {
          if (query_clone.Data.length > 0) {
            that.setData({
              project: query_clone.Data,
              xixi: true,
            })

          }

        } else {
          that.setData({
            project: '',
            xixi: false,

          })

        }
       
      }
    })
  },
  // onShow: function () {
  //   console.log("得到当前点击的元素为" + InstallState)
  //   var that = this;
  //   console.log("传递的参数openstate为" + z)
  //   console.log("传递的参数stylestate为" + zz)
  //   console.log("传递的参数userid为" + user)
  //   console.log("传递的参数parkingid为" + parkingid)
  //   wx.request({
  //     url: 'https://www.yunweixinxi.com/android_parking/controllotlist.php?userid=' + user + '&floorflag=' + 0 + '&parkingid=' + parkingid + '&type=' + InstallState + '&openstate=' + z + '&stylestate=' + zz,
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  //     },
  //     //请求后台数据成功 
  //     success: function (res) {

  //       var query_clone = JSON.parse(JSON.stringify(res.data));
  //       if (query_clone.Result == '1') {
  //         if (query_clone.Data.length > 0) {
  //           that.setData({
  //             project: query_clone.Data,
  //             xixi: true,
  //           })

  //         }

  //       } else {
  //         that.setData({
  //           project: '',
  //           xixi: false,

  //         })

  //       }

  //     }
  //   })
  // },
  //搜索
  search:function(){
    
      wx.navigateTo({
        url: '../search/search',
      })
   
   
   
  },
  //选择几层跳转至当前点击层数
  xuanze:function(event){
    
   
    yuze = event.currentTarget.dataset.replyType
    console.log("当前多少层" + yuze)
    var that = this;
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/controllotlist.php?userid=' + user + '&floorflag=' + yuze + '&parkingid=' + parkingid + '&type=' + InstallState + '&openstate=' + z + '&stylestate=' + zz,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
         console.log("选择了车层，重载当前点击车层列表")
        var query_clone = JSON.parse(JSON.stringify(res.data));
        if (query_clone.Result == '1') {
          if (query_clone.Data.length > 0) {
            that.setData({
              project: query_clone.Data,
              xixi: true,
            })

          }

        } else {
          that.setData({
            project: '',
            xixi: false,

          })

        }

      }
    })
  },
  //
  //将计时器赋值给setInter
  handleGetMessage: function (e) {
    console.log(e.target.data)
  },
  list:function(e){
    tiaozhuan = e.currentTarget.id
    console.log("发生了跳转事件,id是" + tiaozhuan)
    wx.navigateTo({
      url: '../list_detail/list_detail?tiaozhuan=' + tiaozhuan,
    })
    
  },
   onShareAppMessage: function () {
     var that = this;
     return {
       title: '云位订吧',
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
