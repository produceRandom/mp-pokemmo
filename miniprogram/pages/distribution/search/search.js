// miniprogram/pages/distribution/search/search.js
const App = getApp()

const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        distribution_list:[],
        groups: [
            {
                id: 0,
                name: 'pokemon_name',
                desc:"精灵"
            },
            {
                id: 1,
                name: 'address',
                desc:"地址"
            },
            {
                id: 2,
                name: 'egg_group',
                desc:"蛋组"
            },
            {
                id: 3,
                name: 'effort_value',
                desc:"努力值"
            },
            {
                id:4,
                name:"carry",
                desc:"携带"
            }
        ],
        groupIndex:0,
        keyword:""
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
        this.loadMore()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    bindPickerChange(e){
        var index = e.detail.value
        var group = this.data.groups[index]
        this.setData({
            groupIndex:index
        })
    },
    search(){
        // var that = this
        // var filterData={}
        // var pokemmo = "pokemmo"
        // filterData[pokemmo] = db.RegExp({
        //     regexp: '小火龙',
        //     options: 'i',
        // }) 
        // console.log(filterData)
        // db.collection('distribution').where({


        //     pokemmo:db.RegExp({
        //         regexp: '小火龙',
        //         options: 'i',
        //     })

        // }).get().then(res=>{
        //     console.log(res)

        //     that.setData({
        //         distribution_list: res.data
        //     })
        // })
        this.reloadList()
    },
    getList() {

        var that = this

        wx.showLoading({
            title: '搜索中',
        })
        wx.cloud.callFunction({
            name: 'get_distribution_list',
            data: {
                group_name: this.data.groups[this.data.groupIndex].name,
                keyword: this.data.keyword,
                page_current: this.data.pager.page_current ? this.data.pager.page_current : '1'
                
            }
        }).then(res => {

            that.setData({
                distribution_list: [...that.data.distribution_list, ...res.result.data.items],
                pager: res.result.data.pager
            })
            console.log(res)
            wx.hideLoading()

        }).catch(res => {
            wx.showToast({
                title: '未搜索到结果',
                icon:'none',
                success(){
                    wx.hideLoading()

                }
            })
            console.log(res)

        })
    },
    setKeyword(e){
        var keyword = e.detail.value
        this.setData({
            keyword: keyword
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
            'distribution_list': []
        })
        this.getList()
    }
})