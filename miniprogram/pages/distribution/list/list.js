// miniprogram/pages/distribution/list/list.js
const App = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        distribution_list:[],
        pager:{},
        area_id:1,
        mode:'card'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
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
        this.loadMore()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getList(){

        var that = this
        
        // 查询当前用户所有的 counters
        // db.collection('distribution').get().then(res => {
        //     // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        //     console.log(res.data)
        //     that.setData({
        //         distribution_list:res.data
        //     })
        // })
        wx.showLoading({
            title: '获取中',
        })
        wx.cloud.callFunction({
            name: 'get_distribution_list',
            data:{
                area_id:this.data.area_id,
                page_current: this.data.pager.page_current ? this.data.pager.page_current:'1'
            }
        }).then(res=>{
            console.log(res)
            that.setData({
                distribution_list: [...that.data.distribution_list, ...res.result.data.items],
                pager: res.result.data.pager
            })

            wx.hideLoading()
            
        }).catch(res=>{
            console.log(res)
            wx.hideLoading()

        })
    },
    changeTab(e) {
        var area_id = e.currentTarget.dataset.area_id;
        if (area_id == this.data.area_id) {
            return;
        }
        this.setData({
            area_id: area_id
        })

        this.reloadList()

    },
    changeMode(e){
        var mode = e.currentTarget.dataset.mode
        wx.pageScrollTo({
            scrollTop: 0,
        })
        this.setData({
            mode:mode
        })

    },
    loadMore() {

        var pager = this.data.pager;
        if (pager.page_total > pager.page_current) {
            pager.page_current = pager.page_current - -1;
            this.getList()
        }

    },
    reloadList(){
        this.setData({
            'pager.page_current': '1',
            'distribution_list': []
        })
        this.getList()
    }
})