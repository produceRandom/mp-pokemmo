// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 50
// 云函数入口函数

exports.main = async (e, context) => {
    var page_current = e.page_current ? e.page_current : 1


    var keyword = e.keyword ? e.keyword : ""

    var filterData = {}
    if(keyword != ''){
        filterData.pokemon_name = db.RegExp({
            regexp: keyword,
            options: 'i',
        })
    }
    const countResult = await db.collection('pokemon').where(filterData).count()
    const total = countResult.total
    // 计算需分几次取
    const page_total = Math.ceil(total / MAX_LIMIT)


    return await db.collection('pokemon').where(filterData).skip((page_current - 1) * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {

        return {
            data: {
                items: res.data,
                pager: {
                    page_current: page_current,
                    page_total: page_total,
                    total: total
                }
            },
            errMsg: res.errMsg,

        }
    })





}