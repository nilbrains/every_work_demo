var toast = {
  timeout: null,
  init() {
    var toastNode = document.createElement('div')
    toastNode.innerHTML = '<span class="text"></span>'
    toastNode.id = 'NilToast' // 设置id，一个页面有且仅有一个Toast
    toastNode.setAttribute('class', 'toast') // 设置类名
    toastNode.style.display = 'none' // 设置隐藏
    document.body.appendChild(toastNode)
  },
  show(text, duration) {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    if (!text) {
      console.error('text 不能为空!')
      return
    }
    var $nilToast = document.getElementById('NilToast')
    // console.log('$nilToast', $nilToast)
    if (!$nilToast) {
      return
    }
    var domToastText = $nilToast.querySelector('.text') // 文字
    domToastText.innerHTML = text || ''
    $nilToast.style.display = 'block'

    this.timeout = setTimeout(() => {
      $nilToast.style.display = 'none'
      this.timeout = null // 置 TimeOut 引用为空
    }, duration || 2000)
  },
  hide() {
    // 如果 TimeOut 存在
    if (this.timeout) {
      // 清空 TimeOut 引用
      clearTimeout(this.timeout)
      this.timeout = null
    }
    var $nilToast = document.getElementById('NilToast')
    if ($nilToast) {
      $nilToast.style.display = 'none'
    }
  },
}

var sudoku_symbol = {
  CHESS_PLAYER_ONE: 1,
  CHESS_PLAYER_TWO: 2,
  CHESS_PLAYER_CHAR: ['O', 'X'],
  BOARD: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  current_player: 1,
  gameover: false,
  step: 0,
  $chess_in_board: document.querySelectorAll('.js-chess'),
  $message: document.querySelector('.js-message'),
  $startBtn: document.querySelector('.js-start'),

  whoWin(board, player) {
    for (let y = 0; y < 3; y++) {
      let win = true
      for (let x = 0; x < 3; x++) {
        if (board[y * 3 + x] !== player) {
          win = false
          break
        }
      }
      if (win) return true
    }

    for (let y = 0; y < 3; y++) {
      let win = true
      for (let x = 0; x < 3; x++) {
        if (board[x * 3 + y] !== player) {
          win = false
          break
        }
      }
      if (win) return true
    }

    {
      // 正对角线
      let win = true
      for (let i = 0; i < 3; i++) {
        if (board[i * 3 + i] !== player) {
          win = false
          break
        }
      }
      if (win) return true
    }

    {
      // 反对角线
      let win = true
      for (let i = 0; i < 3; i++) {
        if (board[i * 3 + 2 - i] !== player) {
          win = false
          break
        }
      }
      if (win) return true
    }

    return false
  },
  AI(board, player) {
    // 判断自己是否能赢
    let point = this.whoWin(board, player)
    if (point) {
      return {
        point: point,
        result: 1,
      }
    }
    let result = -1
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (board[y * 3 + x] !== 0) continue

        let tmp = this.clone(board)
        tmp[y * 3 + x] = player
        let opp = this.AI(tmp, 3 - player)
        if (-opp.result >= result) {
          point = [x, y]
          result = -opp.result
        }
      }
    }
    return {
      point: point,
      result: point ? result : 0,
    }
  },
  clone(arr) {
    return Object.create(arr)
  },
  /**
   * 下一个棋子
   * @param {Number} pos 棋位
   * @param {String} player 玩家
   */
  onChess(pos, player) {
    pos -= 1
    this.$chess_in_board[pos].innerHTML = this.CHESS_PLAYER_CHAR[player - 1]
    this.$chess_in_board[pos].classList.add(['one', 'two'][player - 1])
    this.BOARD[pos] = player
    this.step++
  },
  initEvent() {
    this.$startBtn.onclick = () => {
      this.$chess_in_board.forEach((item) => {
        item.innerHTML = ''
        item.classList.remove('one')
        item.classList.remove('two')
      })
      this.$message.innerHTML = "游戏开始"
      this.step = 0
      this.BOARD = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      this.current_player = 1
      this.gameover = false
    }

    this.$chess_in_board.forEach((item) => {
      item.onclick = (e) => {
        let pos = e.target.dataset.pos
        if (this.gameover) {
          toast.show('游戏已经结束啦~')
          return
        }
        if (this.BOARD[pos - 1] !== 0) {
          toast.show('这里已经下过棋了哟~')
          return
        }
        this.current_player =
          this.current_player === this.CHESS_PLAYER_ONE
            ? this.CHESS_PLAYER_TWO
            : this.CHESS_PLAYER_ONE
        this.onChess(pos, this.current_player)
        this.current_player =
          this.current_player === this.CHESS_PLAYER_ONE
            ? this.CHESS_PLAYER_TWO
            : this.CHESS_PLAYER_ONE
        const { point } = this.AI(this.BOARD, this.current_player)
        point && this.onChess(point[1] * 3 + point[0] + 1, this.current_player)
        if (this.step === 9) {
          this.gameover = true
          toast.show('平局')
          this.$message.innerHTML = '平局'
        }
        if (this.whoWin(this.BOARD, this.current_player)) {
          this.gameover = true
          toast.show(['电脑', '你'][this.current_player - 1] + '赢啦')
          this.$message.innerHTML =
            ['电脑', '你'][this.current_player - 1] + '赢啦'
          // console.log(this.current_player, 'win')
        }
      }
    })
  },
  /**
   * 初始化游戏
   */
  init() {
    toast.init()
    this.initEvent()
  },
}

sudoku_symbol.init()
