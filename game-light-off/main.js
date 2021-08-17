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

let game = {
  n: 5,
  gameStart: false,
  // 游戏抽象数据
  gamePanel: [],
  nowlevel: [],
  level: 0,
  step: 0,
  /**
   * @type {Element} light
   */
  light: document.querySelectorAll('.js-light'),

  initGamePanel() {
    const array = new Array(this.n * this.n)
    array.fill(0)
    this.gamePanel = array
    this.gamePanel.forEach((ele, index) => {
      document.querySelectorAll('.js-light')[index].classList.remove('wite')
      document
        .querySelectorAll('.js-light')
        [index].classList.replace('on', 'off')
    })

    this.step = 0
    document.querySelector('.js-step').innerHTML = `共计 ${this.step} 步`
  },
  /**
   *
   * @param {Array} posxys
   */
  lightChangeState(posxys) {
    posxys.forEach(({ x, y }) => {
      // console.log('[ x ] >', x)
      // console.log('[ y ] >', y)
      const pos = y * this.n + x
      // light[pos]
      if (
        document.querySelectorAll('.js-light')[pos].classList.contains('off')
      ) {
        document
          .querySelectorAll('.js-light')
          [pos].classList.replace('off', 'on')
      } else {
        document
          .querySelectorAll('.js-light')
          [pos].classList.replace('on', 'off')
      }

      this.gamePanel[pos] = this.gamePanel[pos] === 0 ? 1 : 0
    })
    // console.log('[ this.gamePanel ] >',this.gamePanel)
    // this.printPanel()

    // let temp = []
    // this.gamePanel.forEach((element, index) => {
    //   if (element == 1) {
    //     temp.push(this.getLightPosInPanel(index+1))
    //   }
    // })

    // console.log(
    //   '%c [ this.temp ]',
    //   'font-size:13px; background:pink; color:#bf2c9f;',
    //   JSON.stringify(temp)
    // )
  },

  getLightPosInPanel(pos) {
    const xt = pos % this.n

    const yt = ~~(pos / this.n)

    const x = xt === 0 ? this.n - 1 : xt - 1
    const y = yt === this.n ? yt - 1 : xt === 0 ? yt - 1 : yt

    return {
      x,
      y,
    }
  },

  printPanel() {
    var result = []
    for (var i = 0, len = this.gamePanel.length; i < len; i += 5) {
      result.push(this.gamePanel.slice(i, i + 5))
    }
    console.log('[ printPanel ] >', result)
  },
  isWin() {
    return !this.gamePanel.includes(1)
  },
  serchNearLight(posxy) {
    const lim = [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: +1, y: 0 },
      { x: 0, y: +1 },
    ]
    const limT = []
    const { x, y } = posxy
    lim.forEach((item) => {
      limT.push({
        x: item.x + x,
        y: item.y + y,
      })
    })

    // console.log('[ lim ] >', lim)

    const poss = limT.filter((item) => {
      return (
        item.x >= 0 &&
        item.x <= this.n - 1 &&
        item.y >= 0 &&
        item.y <= this.n - 1
      )
    })

    return poss
  },

  initEvent() {
    this.light.forEach((element) => {
      console.clear()
      element.onclick = (e) => {
        const pos = e.target.dataset.pos
        // console.log('[ pos ] >', pos)
        const posxy = this.getLightPosInPanel(pos)
        const poss = this.serchNearLight(posxy)
        this.lightChangeState([posxy, ...poss])
        this.step++
        document.querySelector('.js-step').innerHTML = `共计 ${this.step} 步`

        if (this.gameStart && this.isWin()) {
          console.log('赢啦')
          this.gameStart = false
          toast.show('游戏结束 赢啦！！')
        }
      }
    })

    document.querySelector('.js-reset').onclick = () => {
      this.initGamePanel()
      this.lightChangeState(this.nowlevel)

      toast.show('重新开始')
    }

    document.querySelector('.js-start').onclick = () => {
      this.initGamePanel()
      this.start()

      toast.show('游戏开始')
    }
  },
  //
  init() {
    toast.init()
    this.initEvent()
    // console.log('[ this.gamePanel ] >', this.gamePanel)
  },

  start() {
    this.level = ~~(Math.random() * level.length)
    this.nowlevel = level[this.level]
    this.lightChangeState(this.nowlevel)
    document.querySelector('.js-level').innerHTML = `目前第 ${this.level} 关`
    this.gameStart = true
  },
}

game.init()
// game.start()
