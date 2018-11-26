// miniprogram/pages/pokemon/list/list.js
const App = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pokemon_list: [],
        pager: {},
        keyword:''
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
    getList() {

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

        var data = {
            page_current: this.data.pager.page_current ? this.data.pager.page_current : '1'
        }
        if(this.data.keyword!=''){
            data.keyword = this.data.keyword
        }
        wx.cloud.callFunction({
            name: 'get_pokemon_list',
            data: data
        }).then(res => {
            console.log(res)
            that.setData({
                pokemon_list: [...that.data.pokemon_list, ...res.result.data.items],
                pager: res.result.data.pager
            })

            wx.hideLoading()

        }).catch(res => {
            console.log(res)
            wx.hideLoading()

        })
    },
    loadMore() {

        var pager = this.data.pager;
        if (pager.page_total > pager.page_current) {
            pager.page_current = pager.page_current - -1;
            this.getList()
        }

    },
    reloadList() {
        this.setData({
            'pager.page_current': '1',
            'pokemon_list': []
        })
        this.getList()
    },
    setKeyword(e) {
        var keyword = e.detail.value
        this.setData({
            keyword: keyword
        })
    },
    search(){
        this.reloadList()
    }
})