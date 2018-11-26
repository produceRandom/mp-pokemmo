// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 50
// 云函数入口函数

exports.main = async (e, context) => {
    var page_current = e.page_current?e.page_current:1
    
    var area_id = parseInt(e.area_id ? e.area_id:0)
    var group_name = e.group_name ? e.group_name:''
    var keyword = e.keyword?e.keyword:""
    
    var filterData = {}
    if (area_id > 0) {
        filterData.area_id = area_id
    }
    if (group_name != ''){
        
        filterData[group_name] = db.RegExp({
            regexp: keyword,
            options: 'i',
        })
    }
    const countResult = await db.collection('distribution').where(filterData).count()
    const total = countResult.total
    // 计算需分几次取
    const page_total = Math.ceil(total / MAX_LIMIT)


    return await db.collection('distribution').where(filterData).skip((page_current-1) * MAX_LIMIT).limit(MAX_LIMIT).get().then(res=>{

        return {
            data:{
                items:res.data,
                pager:{
                    page_current:page_current,
                    page_total: page_total,
                    total:total
                }
            },
            errMsg:res.errMsg,
            
        }
    })

    



}