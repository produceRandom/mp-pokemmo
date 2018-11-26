// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    var id = parseInt(event.id);
    const getPokemon = db.collection('pokemon').where({ id: id }).get()
    const getStat = db.collection('pokeStat').where({ pokemonId: id }).get()
    return await Promise.all([getPokemon,getStat]).then(([pokemon,pokeStat])=>{
        var data = {}
        data = {...data,...pokemon.data[0]}
        data.stat = pokeStat.data[0]

        return{
            data:data,
            pokemon:pokemon,
            pokeStat:pokeStat
        }
    })
}