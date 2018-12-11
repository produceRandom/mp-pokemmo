// pages/2048/2048.js
Page({



    canvasIdErrorCallback: function (e) {
        console.error(e.detail.errMsg)
    },
  /**
   * 页面的初始数据
   */
    data: {
        width:0,
        height:0,
        title:"五子棋",
        chessBoard:[],
        wins:[],
        count:0,
        blackWin:[],
        whiteWin:[],
        black:true,
        double:false

    },


    //开始(vs电脑)
    start:function(e){    

        // 初始化棋盘
        var chessBoard = this.data.chessBoard
        for (var i = 0; i <= 16; i++) {
            chessBoard[i] = []
            for (var j = 0; j <= 16; j++) {
            chessBoard[i][j] = 0
            }
        }
        this.setData({
            chessBoard: chessBoard,
            black:true,
            double:false

        })


        //创建赢法数组
        this.createWinsArray()
    },

    // 开始(双人)
    startDouble:function(){
        //初始化棋盘与创建赢法数组
        var chessBoard = this.data.chessBoard
        for (var i = 0; i <= 16; i++) {
            chessBoard[i] = []
            for (var j = 0; j <= 16; j++) {
                chessBoard[i][j] = 0
            }
        }
        this.setData({
            chessBoard: chessBoard,
            black: true,
            double: true

        })
        this.createWinsArray()
    },

    //双人时，落棋事件
    chessDownDouble: function (e) {

        var that = this


        // 根据触摸的位置判定落棋点
        var x = e.target.offsetLeft;
        var y = e.target.offsetTop;
        var i = (x + 30) / 20
        var j = (y + 30) / 20


        var chessBoard = this.data.chessBoard
        var wins = this.data.wins
        var count = this.data.count
        var blackWin = this.data.blackWin
        var whiteWin = this.data.whiteWin

        //如果该位置有棋子，不操作，结束
        if (chessBoard[i][j] != 0) {
            return
        }


        // 如果此时是下棋方是黑方
        if(this.data.black){
            // 落子
            chessBoard[i][j] = 1

            // 遍历所有赢法，
            for (var k = 0; k < count; k++) {
                //当落棋点存在第k种赢法
                if (wins[i][j][k]) {
                    // 给黑棋的赢法数组的第k种赢法做记录
                    blackWin[k]++
                    //白棋赢法数组的第k种赢法设置为不可能赢的值
                    whiteWin[k] = 6

                    //如果黑棋的第k种赢法记录数为5.则获胜
                    if (blackWin[k] == 5) {
                        wx.showModal({
                            title: '黑胜',
                            content: '',
                            confirmText: "重新开始",
                            success: function (res) {
                                if (res.confirm) {
                                    that.startDouble()
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                }
            }
        }else{

            // 下棋方是白方，落子
            chessBoard[i][j] = 2

            // 遍历所有赢法，
            for (var k = 0; k < count; k++) {
                //当落棋点存在第k种赢法
                if (wins[i][j][k]) {

                    // 给白棋的赢法数组的第k种赢法做记录
                    whiteWin[k]++


                    //黑棋赢法数组的第k种赢法设置为不可能赢的值
                    blackWin[k] = 6

                    //如果白棋的第k种赢法记录数为5.则获胜
                    if (whiteWin[k] == 5) {
                        wx.showModal({
                            title: '白胜',
                            content: '',
                            confirmText:"重新开始",
                            success: function (res) {
                                if (res.confirm) {
                                    that.startDouble()
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                }
            }
        }

        // 落棋后更新棋盘，更新黑白方赢法数组，改变下棋方
        this.setData({
            chessBoard: chessBoard,
            black: !this.data.black,
            blackWin: blackWin,
            whiteWin: whiteWin
        })
    } ,
    // vs电脑时，落子处理
    chessDown:function(e){
        // 根据触摸的位置判定落棋点
        var that = this
        var x= e.target.offsetLeft;
        var y = e.target.offsetTop;
        var i = (x+30)/20
        var j = (y + 30) / 20

        var chessBoard = this.data.chessBoard
        var wins = this.data.wins
        var count = this.data.count
        var blackWin = this.data.blackWin
        var whiteWin = this.data.whiteWin

        //如果该位置有棋子，不操作，结束
        if (chessBoard[i][j] != 0){
            return
        }
       
       // 黑方（玩家）落子,遍历赢法与记录等，和双人时黑方落子相同
        chessBoard[i][j] = 1
        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                blackWin[k]++
                whiteWin[k] = 6
                if (blackWin[k] == 5) {
                    wx.showModal({
                        title: '黑胜',
                        content: '',
                        confirmText: "重新开始",
                        success: function (res) {
                            if (res.confirm) {
                                that.start()
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            }
        }
        
        //计算机下棋
        // 创建数组，为计算机与玩家的每个落棋点记录分数
        var myScore = [];
        var computerScore = [];
        var max = 0;
        var u = 0, v = 0;

        // 初始化棋盘所有落棋点分数为0
        for (var i = 0; i < 15; i++) {
            myScore[i] = [];
            computerScore[i] = [];
            for (var j = 0; j < 15; j++) {
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }

        // 遍历棋盘中可落子的点，记录分数
        // 分数规则：可落子的点满足的赢法计数从1到4分别加上对应的200 400 2000 10000分
        // 分数记完后。选取其中分数最高的点(坐标u,v)落子
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if (chessBoard[i][j] == 0) {
                    for (var k = 0; k < count; k++) {
                        if (wins[i][j][k]) {
                            if (blackWin[k] == 1) {
                                myScore[i][j] += 200;
                            } else if (blackWin[k] == 2) {
                                myScore[i][j] += 400;
                            } else if (blackWin[k] == 3) {
                                myScore[i][j] += 2000;
                            } else if (blackWin[k] == 4) {
                                myScore[i][j] += 10000;
                            }

                            if (whiteWin[k] == 1) {
                                computerScore[i][j] += 220;
                            } else if (whiteWin[k] == 2) {
                                computerScore[i][j] += 420;
                            } else if (whiteWin[k] == 3) {
                                computerScore[i][j] += 2100;
                            } else if (whiteWin[k] == 4) {
                                computerScore[i][j] += 20000;
                            }
                        }
                    }
                    
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    } else if (myScore[i][j] == max) {
                        if (computerScore[i][j] > computerScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }

                    if (computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        u = i;
                        v = j;
                    } else if (computerScore[i][j] == max) {
                        if (myScore[i][j] > myScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }

                }
            }
        }    
        chessBoard[u][v] = 2
        for (var k = 0; k < count; k++) {
            if (wins[u][v][k]) {
                whiteWin[k]++
                blackWin[k] = 6
                if (whiteWin[k] == 5) {
                    if (whiteWin[k] == 5) {
                        wx.showModal({
                            title: '白胜',
                            content: '',
                            confirmText: "重新开始",
                            success: function (res) {
                                if (res.confirm) {
                                    that.start()
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                }
            } 
        }      
        // 落棋后更新棋盘，更新黑白方赢法数组，改变下棋方
        this.setData({
            chessBoard: chessBoard,
            black:!this.data.black,
            blackWin: blackWin,
            whiteWin: whiteWin
        })
    },

    createWinsArray:function(){
        // 创建赢法数组
        var wins = []
        for (i = 0; i <= 16; i++) {
            wins[i] = []
            for (j = 0; j <= 16; j++) {
                wins[i][j] = []
            }

        }
        var count = 0
        //横线赢法
        for (var i = 0; i <= 16; i++) {
            for (var j = 0; j <= 12; j++) {
                for (var k = 0; k < 5; k++) {
                wins[i][j + k][count] = true
                }
                count++
            }

        }
        //竖线赢法
        for (var i = 0; i <= 16; i++) {
            for (var j = 0; j <= 12; j++) {
                for (var k = 0; k < 5; k++) {
                wins[j + k][i][count] = true
                }
                count++
            }

        }
        //斜线赢法
        for (var i = 0; i <= 12; i++) {
            for (var j = 0; j <= 12; j++) {
                for (var k = 0; k < 5; k++) {
                wins[i + k][j + k][count] = true
                }
                count++
            }

        }
        //反斜线赢法
        for (var i = 0; i <= 12; i++) {
            for (var j = 16; j > 3; j--) {
                for (var k = 0; k < 5; k++) {
                wins[i + k][j - k][count] = true
                }
                count++
            }

        }	


        // 初始化黑白方的所有赢法计数为0
        var blackWin = []
        var whiteWin = []
        for (var i = 0; i < count; i++) {
            blackWin[i] = 0;
            whiteWin[i] = 0
        }
    

        this.setData({
            wins: wins,
            count: count,
            blackWin: blackWin,
            whiteWin: whiteWin
        })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

    this.createWinsArray()
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
  
  }

})