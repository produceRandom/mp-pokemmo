// miniprogram/pages/distribution/pokeDetail/pokeDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.id){


            this.setData({ poke_id: options.id })
            
            this.getDetail(options.id).then(res=>{
                this.getDistribution(options.id)

            })
        }
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
    getDetail(id){

        var that = this
        return wx.cloud.callFunction({
            name: 'get_pokemon_detail',
            data: {
                id: id
            }
        }).then(res => {
            console.log(res)
            that.setData({
                'pokeDetail': res.result.data,

            })


        }).catch(res => {
            console.log(res)


        })

    },
    getDistribution(id){
 
        var that = this
        wx.showLoading({
            title: '获取中',
        })
        return wx.cloud.callFunction({
            name: 'get_poke_distribution_detail',
            data: {
                id: id
            }
        }).then(res => {
            console.log(res)
            that.setData({
                'pokeDetail.pokemon_name': res.result.data.pokemon_name,
                'pokeDetail.egg_group': res.result.data.egg_group,
                'pokeDetail.effort_value': res.result.data.effort_value,
                'pokeDetail.distrbution': res.result.data.distrbution
            })

            wx.hideLoading()

        }).catch(res => {
            console.log(res)
            wx.hideLoading()

        })
    }
})