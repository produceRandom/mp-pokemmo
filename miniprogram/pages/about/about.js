// miniprogram/pages/about/about.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showAd:true
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

    },
    waitOpen(){
        wx.showToast({
            title: '开发中',
            icon:'none'
        })
    },
    // showContact(){
    //     wx.showModal({
    //         title: '联系方式',
    //         content: '如需反馈bug，更改意见等，可添加微信：z1010446826',
    //     })
    // },
    closeAd(){
        this.setData({
            showAd:false
        })
    }

})