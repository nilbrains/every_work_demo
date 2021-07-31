var nil_emoji_canvas = {
  penColor: '',
  penSize: 5,
  canvas: null,
  ctx: null,
  running: '',
  canvasHistory: [],
  canvasHistoryIndex: -1,

  colors: ['#000', '#ff4400','#FF00FF',"#99CC66","#FF6666", '#ccc', '#fff'],
  /**
   * @type {Element}
   */
  colorInput: document.querySelector('.js-color'),

  /**
   * @type {Element}
   */
  colorNowDiv: document.querySelector('.js-color-now'),

  // 注入颜色
  initColor() {
    const colorList = document.querySelector('.js-color-list')
    console.log('[ colorList ] >', colorList)
    this.colors.forEach((item) => {
      // console.log(item)
      let div = document.createElement('div')
      div.classList.add('color_item', 'js-select-color')
      div.setAttribute('style', `background-color:${item}`)
      div.setAttribute('data-color', item)
      // console.log('[ div ] >', div)
      colorList.appendChild(div)
    })
    this.colorInput.value = this.colors[0]
    this.colorNowDiv.setAttribute('style', `background-color:${this.colors[0]}`)
    this.penColor = this.colors[0]
  },
  // 添加事件
  addEvent() {
    const that = this
    // 选择颜色
    const colorSelects = document.querySelectorAll('.js-select-color')
    colorSelects.forEach((item) => {
      // console.log('[ item ] >', item)
      item.onclick = function () {
        console.log(item.dataset.color)
        that.colorInput.value = item.dataset.color
        that.colorNowDiv.setAttribute(
          'style',
          `background-color:${item.dataset.color}`
        )
        that.penColor = item.dataset.color
      }
    })

   const clearBtn = document.querySelector('.js-clear')
    clearBtn.onclick = () => {
      // console.log('clearBtn')
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.fillStyle = '#fff'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      this.canvasHistory.length = 0
      this.canvasHistoryIndex = -1
    }

    // 上一步
    const backBtn = document.querySelector('.js-back')
    backBtn.onclick = () => {
      // console.log('backBtn')
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.ctx.fillStyle = '#fff'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      console.log(' [ this.canvasHistoryIndex backBtn]', this.canvasHistoryIndex)
      console.log('%c [ this.canvasHistoryIndex - 1 backBtn]', 'font-size:13px; background:pink; color:#bf2c9f;', this.canvasHistoryIndex - 1)
      if (this.canvasHistoryIndex - 1 >= -1) {
        this.canvasHistoryIndex--
        // console.log(this.canvasHistory[this.canvasHistoryIndex])
        this.canvasHistory[this.canvasHistoryIndex] && 
        this.ctx.putImageData(this.canvasHistory[this.canvasHistoryIndex], 0, 0)
        this.canvasHistory.length = this.canvasHistoryIndex < 0 ? 0 : this.canvasHistoryIndex
        // console.log('%c [ this.canvasHistory.length ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.canvasHistory.length)
      }
    }

    const upBtn = document.querySelector('.js-up')
    upBtn.onclick = () => {
      const inputObj = document.createElement('input')
      inputObj.addEventListener('change', this.readFile, false)
      inputObj.type = 'file'
      inputObj.accept = 'image/*'
      inputObj.style.display = 'none'
      inputObj.click()
    }
    // 保存
    const saveBtn = document.querySelector('.js-save')
    const showdiv = document.querySelector('.js-save-show')
    saveBtn.onclick = () => {
      const img = new Image()
      img.src = this.canvas.toDataURL('image/png', 1)
      showdiv.innerHTML = ''
      showdiv.append(img)
      showdiv.style.display = 'flex'
    }
    showdiv.onclick = () => {
      showdiv.style.display = 'none'
    }
    const penRange = document.querySelector('.js-pen')
    const penRangeShow = document.querySelector('.js-pen-show')
    penRange.onchange = () => {
      penRangeShow.innerHTML = penRange.value
      this.penSize = penRange.value
    }
  },
  readFile() {
    var file = this.files[0] //获取input输入的图片
    if (!/image\/\w+/.test(file.type)) {
      alert('请确保文件为图像类型')
      return false
    } //判断是否图片，在移动端由于浏览器对调用file类型处理不同，虽然加了accept = 'image/*'，但是还要再次判断
    var reader = new FileReader()
    reader.readAsDataURL(file) //转化成base64数据类型
    reader.onload = function (e) {
      let img = new Image()
      img.src = this.result
      img.onload = function () {
        //必须onload之后再画
        nil_emoji_canvas.ctx.drawImage(
          img,
          0,
          0,
          nil_emoji_canvas.canvas.width,
          nil_emoji_canvas.canvas.height
        )

        nil_emoji_canvas.canvasHistoryIndex++
      console.log(' [ this.canvasHistoryIndex backBtn]', this.canvasHistoryIndex)

        nil_emoji_canvas.canvasHistory.push(
          nil_emoji_canvas.ctx.getImageData(
            0,
            0,
            nil_emoji_canvas.canvas.width,
            nil_emoji_canvas.canvas.height
          )
        )
      }
    }
  },
  toDraw(x, y) {
    this.ctx.lineTo(x, y) // 画路径
    this.ctx.lineWidth = this.penSize
    this.ctx.strokeStyle = this.penColor
    this.ctx.stroke() // 描边
    this.ctx.save() // 保存状态
  },
  // 初始化画布
  initCanvas() {
    this.canvas = document.querySelector('#canvas')
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.canvas.onmousedown = (e) => {
      const sx = e.pageX - this.canvas.offsetLeft, //做个换算以防万一
        sy = e.pageY - this.canvas.offsetTop

      this.running = 'draw'
      this.ctx.beginPath()
      this.ctx.moveTo(sx, sy)
    }
    this.canvas.onmousemove = (e) => {
      if (this.running == 'draw') {
        this.toDraw(
          e.pageX - this.canvas.offsetLeft,
          e.pageY - this.canvas.offsetTop
        )
      }
    }
    canvas.onmouseup = (e) => {
      this.running = ''
      this.canvasHistoryIndex++
      this.canvasHistory.push(
        this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      )
      console.log(
        '%c [ this.canvasHistory ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.canvasHistory
      )
    }
    // phone
    canvas.addEventListener(
      'touchstart',
      (e) => {
        const sx = e.touches[0].clientX - this.canvas.offsetLeft, //做个换算以防万一
          sy = e.touches[0].clientY - this.canvas.offsetTop

        this.running = 'draw'
        this.ctx.beginPath()
        this.ctx.moveTo(sx, sy)
      },
      false
    )
    canvas.addEventListener(
      'touchmove',
      (e) => {
        if (this.running == 'draw') {
          this.toDraw(
            e.touches[0].clientX - this.canvas.offsetLeft,
            e.touches[0].clientY - this.canvas.offsetTop
          )
        }
      },
      false
    )
    canvas.addEventListener(
      'touchend',
      () => {
        this.running = ''
        this.canvasHistoryIndex++
        this.canvasHistory.push(
          this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        )
        console.log(
          '%c [ this.canvasHistory ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          this.canvasHistory
        )
      },
      false
    )
  },
  // 初始化
  init() {
    this.initColor()
    this.initCanvas()
    this.addEvent()
  },
}

document.body.addEventListener(
  'touchmove',
  function (e) {
    e.preventDefault()
  },
  { passive: false }
)
nil_emoji_canvas.init()
