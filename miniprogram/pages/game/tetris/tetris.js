// pages/tetris/tetris.js
// 

// 定义方块构造函数(要是不知道构造函数是什么，你就勉强当做类来理解吧)
var Square = function () {
    var t = (Math.floor(Math.random()*20)+1)%7;      
    this.origin = {
        x: -2,
        y: 3
    }
    switch (t) {
        case 0: {
            this.data = [
                [0, 0, 0, 0],
                [0, 0, 2, 2],
                [0, 2, 2, 0],
                [0, 0, 0, 0]
            ]
            break;
        }
        case 1: {
            this.data = [
                [0, 0, 0, 0],
                [2, 2, 0, 0],
                [0, 2, 2, 0],
                [0, 0, 0, 0]
            ]
            break;
        }
        case 2: {
            this.data = [
                [0, 0, 0, 0],
                [2, 2, 2, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
            break;
        }
        case 3: {
            this.data = [
                [0, 0, 0, 0],
                [0, 2, 2, 0],
                [0, 2, 2, 0],
                [0, 0, 0, 0]
            ]
            break;
        }
        case 4: {
            this.data = [
                [0, 0, 0, 0],
                [2, 2, 2, 0],
                [0, 0, 2, 0],
                [0, 0, 0, 0]
            ]
            break;
        }
        case 5: {
            this.data = [
                [0, 0, 0, 0],
                [2, 2, 2, 0],
                [2, 0, 0, 0],
                [0, 0, 0, 0]
            ]
            break;
        }
        case 6: {
            this.data = [
                [0, 0, 0, 0],
                [0, 0, 2, 0],
                [0, 2, 2, 2],
                [0, 0, 0, 0]
            ]

            break;
        }
    }


}
Square.prototype.canDown = function (isValid) {
    var test = {}
    test.x = this.origin.x + 1;
    test.y = this.origin.y
    return isValid(test, this.data)
}
Square.prototype.canLeft = function (isValid) {
    var test = {}
    test.x = this.origin.x;
    test.y = this.origin.y - 1;
    return isValid(test, this.data)
}
Square.prototype.canRight = function (isValid) {
    var test = {}
    test.x = this.origin.x;
    test.y = this.origin.y + 1;
    return isValid(test, this.data)
}
Square.prototype.canRotate = function (isValid) {
    var test = {}
    test.x = this.origin.x;
    test.y = this.origin.y;
    test.data = []
    var x0 = 1.5;
    var y0 = -1.5;
    for (var i = 0; i < this.data.length; i++) {
        test.data[i] = []
        for (var j = 0; j < this.data[0].length; j++) {
            test.data[i][j] = 0
        }
    }

    for (var i = 0; i < this.data.length; i++) {
        for (var j = 0; j < this.data[0].length; j++) {
            if (this.data[i][j] == 2) {
                var x = j;
                var y = -i
                var x1 = y - y0 + x0
                var y1 = x0 - x + y0
                //							console.log(x + "--" + y)
                //							console.log(x1 + "--" + y1)
                //							console.log(-y1 + "--" + x1)
                test.data[-y1][x1] = 2
            }
        }
    }
    return isValid(test, test.data)
}


// 定义定时器，分数，当前方块，下一个方块等全局变量
var interval
var lines=0;
var scope = 0;
var cur;
var next

Page({

    /**
     * 页面的初始数据
     */
    data: {
        scope:'0',
        nextData:[
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        gameData : [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        isDisable:false
    },


// 游戏开始
    start:function(){
        // 生成当前方块，下一个存在，把下一个赋值给当前，否则新建一个
        cur = next ? next : new Square()

        // 生成下一个方块
        next = new Square()


        // 开始定时器
        interval = setInterval(this.down, 1000)

        this.setData({
            isDisable:true,
            nextData:next.data
        })
    },
    down:function () {
        var gameData = this.data.gameData

        
        if (cur.canDown(this.isValid)) {
            // 如果可以下落。那么下落
            this.clearData()
            cur.origin.x = cur.origin.x + 1

            // 设置当前方块位置
            this.setCur()
        } else {

            // 无法下落时
            if (this.isOver()) {
                // 判断游戏是否结束

                wx.showModal({
                    title: '提示',
                    content: '游戏结束',
                })
                clearInterval(interval)
                return
            }

            // 把当前方块状态转变成灰色
            for (var i = 0; i < cur.data.length; i++) {
                for (var j = 0; j < cur.data[0].length; j++) {
                    if (this.check(cur.origin, i, j)) {
                        if (cur.data[i][j] != 0) {
                            gameData[cur.origin.x + i][cur.origin.y + j] = 1
                        }
                    }
                }
            }

            // 继续生成当前方块和下一个方块
            cur = next
            next = new Square()
            this.setData({
                nextData: next.data
            })


            // 消行
            this.clearLine()
        }

    },

// 判断下一个位置是否是可以占据的
    isValid:function (pos, data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {
                    if (!this.check(pos, i, j)) {
                        return false
                    }
                }
            }
        }
        return true;
    },

    // 判断坐标是否在画布内
	check:function (pos, x, y) {
        var gameData = this.data.gameData
        if (pos.x + x >= gameData.length) {
            return false
        } else if (pos.x + x < 0) {
            return false;
        } else if (pos.y + y >= gameData[0].length) {
            return false;
        } else if (pos.y + y < 0) {
            return false;
        } else if (gameData[pos.x + x][pos.y + y] == 1) {
            return false;
        } else {
            return true
        }
    },

    // 清楚方块（下落时，上一个位置清楚）
    clearData:function () {
        var gameData = this.data.gameData
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (this.check(cur.origin, i, j)) {
                    if (cur.data[i][j] != 0) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 0
                    }
                }

            }
        }
        this.setData({
            gameData: gameData
        })
    },

    // 设置当前方块
    setCur:function(){
        var gameData = this.data.gameData
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (this.check(cur.origin, i, j)) {
                    if (cur.data[i][j] != 0) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j]
                    }
                }
            }
        }
        this.setData({
            gameData: gameData
        })
    },

    // 左
    left : function () {
        if (cur.canLeft(this.isValid)) {
            this.clearData()
            cur.origin.y = cur.origin.y - 1
            this.setCur();
        }

    },	
    // 右
	right : function () {
        if (cur.canRight(this.isValid)) {
            this.clearData()
            cur.origin.y = cur.origin.y + 1
            this.setCur();
        }

    },
    // 旋转
    rotate: function () {
        //设原点（x,y),中心点(x0,y0) ,原点绕中心点旋转90度后为(x1,y1);
        //则(x-x0)(x1-x0)+(y-y0)(y1-y0)=0
        //所以 x1-x0=y-y0 且 y1-y0= -(x-x0) ;
        //解得一通解为 x1=y-y0+x0,y1=x0-x+y0 ，这就是旋转90度的坐标变换公式
        if (cur.canRotate(this.isValid)) {
            this.clearData()
            var x0 = 1.5;
            var y0 = -1.5;
            var cdata = []
            for (var i = 0; i < cur.data.length; i++) {
                cdata[i] = []
                for (var j = 0; j < cur.data[0].length; j++) {
                    if (cur.data[i][j] == 2) {
                        cdata[i][j] = 2
                        cur.data[i][j] = 0
                    } else {
                        cdata[i][j] = 0
                    }
                }
            }

            for (var i = 0; i < cdata.length; i++) {
                for (var j = 0; j < cdata[0].length; j++) {
                    if (cdata[i][j] == 2) {

                        var x = j;
                        var y = -i
                        var x1 = y - y0 + x0
                        var y1 = x0 - x + y0
                        // console.log(x + "--" + y)
                        // console.log(x1 + "--" + y1)
                        // console.log(-y1 + "--" + x1)
                        cur.data[-y1][x1] = 2
                    }
                }
            }

           this.setCur()
        }

    },
    // 消行
    clearLine:function(){
        var gameData = this.data.gameData

        for (var i = gameData.length - 1; i >= 0; i--) {
            var count = 0
            for (var j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] == 1) {
                    count = count + 1
                }
            }
            if (count == gameData[0].length) {
                gameData.splice(i, 1)
                gameData.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                lines = lines + 1
                this.clearLine()
            }
        }
        console.log(lines)
        scope = scope - -(lines * 10)
        console.log(scope)
        lines = 0

        this.setData({
            gameData:gameData,
            scope:scope
        })
    },
    // 判断是否结束（下一个方块无法下落，代表结束）
    isOver:function () {
        var test = next
        if (next.canDown(this.isValid)) {
            return false;
        } else {
            return true;
        }
    }
    
})