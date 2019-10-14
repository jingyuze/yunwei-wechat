//index.js
//获取应用实例
const app = getApp()
var Parking_Name = ''
var LotMap
var UR = ''
var parkingid,OpenState,userid,id,type
var project = ''
var keyword=''
var LotType=''
var ID=''
var InstallState = ''
var arr
Page({
  data: {

  },
  onLoad: function () {
    console.log("openstateeeeeeeeeeeeeeee" + app.globalData.OpenState);
    console.log("openstatbbbbbb" + app.globalData.userid);
    console.log("openstatbbbbbb" + app.globalData.parkingid);
    parkingid = app.globalData.parkingid
    OpenState = app.globalData.OpenState
    userid = app.globalData.userid
    console.log("openstateeeeeeeeeeeeeeee" + OpenState);
    console.log("openstatbbbbbb" + userid);
    console.log("openstatbbbbbb" + parkingid);
  },
  keywordInput:function(e){
    keyword = encodeURIComponent(e.detail.value)
  },
  search: function (e) {
    if (keyword==''){
      wx.showToast({
        title: '请输入车位编号',
        icon: 'success',
        duration: 1000
      })

    }else{
      console.log("你点击了搜索" + keyword)
    var that = this;
    
    wx.request({
      url: 'https://www.yunweixinxi.com/android_parking/controlsearch.php',
      method: "GET",
      data: {
        userid: userid,
        parkingid: parkingid,
        keyword:keyword,
        openstate: OpenState
      },

      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      //请求后台数据成功 
      success: function (res) {
       
        var query_clone = JSON.parse(JSON.stringify(res.data));
        if (query_clone.Result == '1') {
        
          that.setData({
            project: query_clone.Data,
            
          })
          
        } else {
          wx.showToast({
            title: '没有此编号',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  }
  },
  //按下按钮后
 put:function(event){
   console.log("openstatbbbbbb" + userid);
   ID = event.currentTarget.dataset.replyType
   console.log("得到当前点击的元素为" + ID)
   arr = [];
   arr=ID.split(",");
   console.log("第一个数据为"+arr[0]+"第二个数据为"+arr[1])
   type = arr[1]
   id = arr[0]
   var that = this;
   wx.request({
     url: 'https://www.yunweixinxi.com/android_parking/controllotitem.php',
     method: "POST",
     data: {
       userid: userid,
       parkingid: parkingid,
       id: id,
       type: type
     },

     header: {
       'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
     },
     //请求后台数据成功 
     success: function (res) {

       var query_clone = JSON.parse(JSON.stringify(res.data));
       if (query_clone.Result == '1') {
         wx.showToast({
           title: '提交成功',
           icon: 'success',
           duration: 1000
         })
         
       
         wx.request({
           url: 'https://www.yunweixinxi.com/android_parking/controlsearch.php',
           method: "GET",
           data: {
             userid: userid,
             parkingid: parkingid,
             keyword: keyword,
             openstate: OpenState
           },

           header: {
             'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
           },
           //请求后台数据成功 
           success: function (res) {

             var query_clone = JSON.parse(JSON.stringify(res.data));
             if (query_clone.Result == '1') {
               wx.showToast({
                 title: '提交成功',
                 icon: 'success',
                 duration: 1000
               })
               that.setData({
                 project: query_clone.Data

               })

             } else {
               wx.showToast({
                 title: '没有此编号',
                 icon: 'success',
                 duration: 1000
               })
             }
           }
         })
        
       } else {
         wx.showToast({
           title: '没有此编号',
           icon: 'success',
           duration: 1000
         })
       }
     }
   })
 },
  //将计时器赋值给setInter
  handleGetMessage: function (e) {
    console.log(e.target.data)
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



