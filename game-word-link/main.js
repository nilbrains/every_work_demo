var game = {
  gameCharStore:
    '祎犇猋娅媭妍嫚婻顕嬛婋翀翙翮翯珝翾昫昉甦晞昍昱暄晢晗旸暔仝暎晟晹昇甠暒眚凊浛湜汧沄湦滢',
  gamePanel: document.querySelector('.js-game-panel'),
  gameChar: [],
  lastPos: undefined,
  score: 0,
  gameSum: 0,
  topScore: 0,
  // 打乱数组
  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  },
  prepareGameChar(x, y) {
    this.gameChar.length = 0
    let sum = x * y
    game.gameSum = sum
    let sum2 = sum / 2
    let rnum = ~~(Math.random() * 12)
    let gc = this.gameCharStore.substr(rnum, sum2).repeat(2)
    this.gameChar = this.shuffleArray(Array.from(gc))
    console.log(
      '%c [ this.gameChar ]',
      'font-size:13px; background:pink; color:#bf2c9f;',
      this.gameChar
    )
  },
  /**
   * 创建 游戏 界面
   * @param {number} x
   * @param {number} y
   */
  createGamePanel(x, y) {
    this.gamePanel.innerHTML = ''
    let width = 100 / x
    let height = 100 / y
    // tr td div
    for (let i = 0; i < y; i++) {
      let tr = document.createElement('tr')
      for (let j = 0; j < x; j++) {
        let td = document.createElement('td')
        td.setAttribute('height', height + '%')
        td.setAttribute('width', width + '%')
        let div = document.createElement('div')
        div.classList.add('nilitem')
        div.setAttribute('pos', `${i}-${j}`)
        div.onclick = game.divClick
        div.innerHTML = this.gameChar[i * x + j]
        td.appendChild(div)
        tr.appendChild(td)
      }
      this.gamePanel.appendChild(tr)
    }
  },

  changeScore(num) {
    game.score += num
    document.querySelector('.js-score').innerHTML = game.score
  },
  goBakc(item) {
    item.style.transform = 'rotateY(180deg)'
    item.style.color = '#f2f2f2'
  },

  toback() {
    this.gamePanel.querySelectorAll('.nilitem').forEach(this.goBakc)
  },

  divClick(e) {
    let { target } = e
    /**
     * @type {string} pos
     */
    let pos = target.getAttribute('pos')
    target.style.transform = ''
    target.style.color = '#222'
    setTimeout(() => {
      if (game.lastPos != undefined) {
        let targeti = game.lastPos.target
        let posi = game.lastPos.target.getAttribute('pos')
        // 进行对比
        if (pos == posi) {
          game.lastPos = e
          return
        }
        if (target.innerHTML != targeti.innerHTML) {
          game.lastPos = e
          game.changeScore(-1)
          targeti.style.color = '#f40'
          setTimeout(() => {
            game.goBakc(targeti)
          }, 800)
          return
        }
        game.changeScore(10)
        game.gameSum -= 2
        document.querySelector(`.nilitem[pos="${pos}"]`).style.display = 'none'
        document.querySelector(`.nilitem[pos="${posi}"]`).style.display = 'none'
        game.lastPos = undefined
        game.isEnd(game.gameSum)
      } else {
        // 存
        game.lastPos = e
      }
    }, 500)
  },
  isEnd(sum) {
    if (sum == 0) {
      if (game.topScore < game.score) {
        localStorage.setItem('score', game.score)
        document.querySelector('.js-topscore').innerHTML = game.score
      }

      NilToast.dialog.alert({
        // 标题
        title: '提示',
        // 弹窗消息
        msg: '游戏结束：得分 ' + game.score,
        // 确认按钮文字
        confirmText: '重新开始',
        // 确认按钮文字样式
        confirmStyle: 'color: #f40',
        // 确认按钮
        confirmClick: function (e, done) {
          // 关闭
          game.init()
          done()
        },
      })
    }
  },
  xyarray: [[2, 3],[2, 4],[2, 5],[2, 6],[3, 4],[3, 6],[4, 4],[4, 5],[4, 6]],
  init() {
    game.score = 0
    game.topScore = localStorage.getItem('score') || 0
    document.querySelector('.js-topscore').innerHTML = game.topScore
    document.querySelector('.js-score').innerHTML = game.score
    NilToast.msg('游戏开始')
    let xy = this.xyarray[~~(Math.random() * this.xyarray.length)]
    game.prepareGameChar(xy[0], xy[1])
    game.createGamePanel(xy[0], xy[1])
    setTimeout(() => {
      game.toback()
    }, 2000)
  },
}
game.init()

document.querySelector(".js-restart").onclick = function(){
  game.init()
}
