// pages/order/order.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const qqmapsdk = new QQMapWX({
  key: 'AJMBZ-5QZ6S-LBQOH-6I7HB-DLRNF-X6BCY' // 必填
});
var latitude, longitude=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suggestion:'',
    panduan:false,
    arr2: []
  },
  backfill: function (e) {
    this.setData({
      panduan: false
    });
    var id = e.currentTarget.id;
    let _val = {}
    _val.latitude = this.data.suggestion[id].latitude
    _val.longitude = this.data.suggestion[id].longitude
    _val.title = this.data.suggestion[id].title
    _val.addr = this.data.suggestion[id].addr
    console.log(_val)
    console.log(this.data.arr2.length)
    var model = JSON.stringify(_val);
      // wx.reLaunch({
      //   url: '../map/map?model=' + model
      // })
     if (this.data.arr2.length == 0){
      this.data.arr2.push(_val)
      
      wx.setStorageSync('location', this.data.arr2);
      wx.getStorage({
        key: 'location',
        success: function (res) {
          //输出缓存内容
          wx.reLaunch({
            url: '../map/map?model=' + model
          })
        }
      })
    }else{
      for (var i = 0; i < this.data.arr2.length; i++) {
      if (this.data.arr2[i].latitude== _val.latitude) {
        //是 不做任何操作
        
        wx.reLaunch({
          url: '../map/map?model=' + model
        })
        return false;
        console.log("nothing")
      } else {
        
        //否，把_val push到arr2中
        
       
        this.setData({
          panduan: true,
          backfill: this.data.suggestion[id].title
        });
      };

    }
  }
      // if (i == id) {
        
   
            
        //判断_val是否在数组中
    if (this.data.panduan == true){
    this.data.arr2.push(_val)
    wx.setStorageSync('location', this.data.arr2);
    wx.getStorage({
      key: 'location',
      success: function (res) {
        //输出缓存内容
        console.log(res.data)
      }
    })
      wx.reLaunch({
        url: '../map/map?model=' + model
      })
        }
  

      
      
    
  },
  getsuggest: function (e) {
    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) {//搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'location',
      success: function (res) {
        for (let i in res.data) {
          that.data.arr2.push(res.data[i])
        };
        that.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: that.data.arr2
        });
        console.log(res)
        console.log(that.data.arr2)
      }
    })
   
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