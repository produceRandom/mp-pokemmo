// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()



// 云函数入口函数
exports.main = async (event, context) => {

    var nodes = `


        <h3>备注</h3>
        <p>在更新某些功能时在这里写出来，比如在更新数据时候，可能短时间出现没法获取数据的情况，</p>
        <p>在分布的表格模式中，位置是草丛的时候并不是绿色，，今天或者明天更新版本时候修复(2018-12-3)</p>

        <h3>计划</h3>
        <p>准备加上技能售卖的城市，有什么好的功能可以做的欢迎联系推荐</p>


        <h3 style="margin-top:20px">反馈</h3>
        <p>如果有意见反馈，可以点击联系方式进行反馈</p>
    
    `

    return {
        data:nodes
    }
}