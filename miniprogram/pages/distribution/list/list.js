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
        var that = this
        wx.showLoading({
            title: '获取中'
        })
        var listData = wx.getStorage({
            key: 'distribution_list_1',
            success(res) {
                wx.hideLoading()

                var listData = res.data

                if (listData != '') {
                    that.setData({
                        distribution_list: listData.distribution_list,
                        pager: listData.pager
                    })
                } else {
                    wx.hideLoading()
                    that.getList()

                }
            },
            fail(e) {
                wx.hideLoading()
                that.getList()
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
        this.loadMore()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getList(){

        var that = this

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
            if (that.data.area_id == '1'){
                wx.setStorageSync('distribution_list_1', {
                    distribution_list: that.data.distribution_list,
                    pager: that.data.pager

                })
            }

            if (that.data.area_id == '2') {
                wx.setStorageSync('distribution_list_2', {
                    distribution_list: that.data.distribution_list,
                    pager: that.data.pager

                })
            }
            if (that.data.area_id == '3') {
                wx.setStorageSync('distribution_list_3', {
                    distribution_list: that.data.distribution_list,
                    pager: that.data.pager

                })
            }
            wx.hideLoading()
            
        }).catch(res=>{
            console.log(res)
            wx.hideLoading()

        })
    },
    changeTab(e) {
        var that = this
        var area_id = e.currentTarget.dataset.area_id;
        if (area_id == this.data.area_id) {
            return;
        }
        this.setData({
            area_id: area_id
        })

        this.setData({
            'pager.page_current': '1',
            'distribution_list': []
        })

        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0,
            // success() {
            //     var listData = wx.getStorageSync(`distribution_list_${area_id}`)
            //     if (listData != '') {
            //         this.setData({
            //             distribution_list: listData.distribution_list,
            //             pager: listData.pager
            //         })
            //         wx.hideLoading()
            //     } else {
            //         wx.hideLoading()
            //         this.reloadList()


            //     }
            // },
            // complete() {
                
            // }
        })
        wx.showLoading({
            title: '获取中'
        })
        var listData = wx.getStorage({
            key: `distribution_list_${area_id}`,
            success(res) {
                wx.hideLoading()

                var listData = res.data

                if (listData != '') {
                    that.setData({
                        distribution_list: listData.distribution_list,
                        pager: listData.pager
                    })
                } else {
                    wx.hideLoading()
                    that.reloadList()

                }
            },
            fail(e) {
                wx.hideLoading()
                that.reloadList()
            }
        })


    },
    changeMode(e){
        var mode = e.currentTarget.dataset.mode
        // wx.showLoading({
        //     title:'切换中'
        // })
        // wx.pageScrollTo({
        //     scrollTop: 0,
        //     duration:0,
        //     success(e){
        //         console.log(e)
        //         this.setData({
        //             mode: mode
        //         })
        //     },
        //     fail(e){
        //         console.log(e)
        //     },
        //     complete(){
        //         wx.hideLoading()
        //     }
        // })
        var distribution_list = this.data.distribution_list

        this.setData({
            'distribution_list': []
        },()=>{
            this.setData({
                mode: mode
            },()=>{
                this.setData({
                    distribution_list: distribution_list
                })
            })
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