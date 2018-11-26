// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    var id = parseInt(event.id);
    // var count = await db.collection('distribution').where({ pokemmo_id: id }).count()
    // return count;
    return await db.collection('distribution').where({pokemon_id:id}).get().then(res=>{
        if(res.data.length>0){
            return {
                data: {
                    pokemon_name: res.data[0].pokemon_name,
                    egg_group: res.data[0].egg_group,
                    effort_value: res.data[0].effort_value,
                    distrbution: res.data
                }
            }
        }

    }).catch(err=>{
        return{
            err:err
        }
    })
}