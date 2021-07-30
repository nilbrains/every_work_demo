var nil_robot = {
  _el: '#chat-box',
  /**
   * @type {Element}
   */
  _chat_container: null,
  /**
   * @type {Element}
   */
  _reply_input: null,
  _isonline: false,
  _duyi_chats_api: 'https://developer.duyiedu.com/edu/turing/chat',
  _history_chats: [],
  /**
   * 返回一条消息 div.chat-item( me | ta )
   * @param {String} type 消息类型 (me | ta )
   * @param {Object} data 消息数据
   */
  _ret_char(type, data) {
    var div = document.createElement('div')
    div.classList.add('chat-item')
    switch (type) {
      case 'me':
        div.classList.add('me')
        div.innerHTML = `<div class="user"><img class="user__head" src="${data.head}" alt="${data.username}"></div><div class="message">${data.message}</div>`
        break
      case 'ta':
        div.classList.add('ta')
        div.innerHTML = `<div class="user"><img class="user__head" src="${data.head}" alt="${data.username}"></div><div class="message">${data.message}</div>`
        break
      case 'time':
        div.classList.add('time')
        var now_time = new Date()
        div.innerHTML = `<div class="time__inner">${now_time.getHours()}:${now_time.getMinutes()}</div>`
        break
      default:
        div.classList.add('ta')
        break
    }
    return div
  },
  // 插入一条消息
  _append_char(issave, type, data) {
    switch (type) {
      case 'me':
        this._chat_container.appendChild(this._ret_char('me', data))
        break
      case 'ta':
        this._chat_container.appendChild(this._ret_char('ta', data))
        break
      case 'time':
        this._chat_container.appendChild(this._ret_char('time'))
        break
      default:
        break
    }
    if (issave)
      this._history_chats.push({
        type,
        data,
      })
    this._to_char_box_bottom()
  },
  // 将聊天界面滑动到最底部
  _to_char_box_bottom() {
    var ele = this._chat_container
    if (ele.scrollHeight > ele.clientHeight) {
      setTimeout(function () {
        //设置滚动条到最底部
        ele.scrollTop = ele.scrollHeight
      }, 100)
    }
  },
  // 机器人回复消息
  _to_reply(isonline, text) {
    console.log('[ isonline ] >', isonline)
    if (isonline) {
      // 渡一api -> 在线api
      // fetch(`${this._duyi_chats_api}?text=${text}`)
      //   .then((response) => response.json())
      //   .then((res) => {
      //     console.log('[ res ] >', res)
      //     if (res.text) {
      //       var msg_data = {
      //         head: './imgs/head_ta.jpg',
      //         username: '渡一api',
      //         message: res.text,
      //       }
      //       this._append_char(true,'ta',msg_data)
      //     }
      //   })
    } else {
      console.log('[ c ] >', chat)
      msgs = chat.filter((item) => item.reg.test(text))[0] || {
        msg: ['你说的话我还不懂呢'],
      }
      console.log('[ msgs ]', msgs)
      const index = Math.floor(Math.random() * msgs.msg.length)
      var msg_data = {
        head: './imgs/head_ta.jpg',
        username: 'LOWB',
        message: msgs.msg[index],
      }
      this._append_char(true, 'ta', msg_data)
    }
  },
  // 绑定事件
  _add_event() {
    // js-reply
    var that = this
    // 回车发送消息
    this._reply_input.onkeyup = function (e) {
      // console.log(e,that._reply_input.value);
      if (e.keyCode === 13) {
        var msg_data = {
          head: './imgs/head_me.jpg',
          username: '我',
          message: that._reply_input.value,
        }
        that._append_char(true, 'me', msg_data)

        // 根据回复内容 匹配聊天话语

        that._to_reply(that._isonline, that._reply_input.value)

        that._reply_input.value = ''
      }
    }

    window.onunload = function () {
      localStorage.setItem('chats', JSON.stringify(that._history_chats))
    }
  },
  _load() {
    this._history_chats =
      JSON.parse(localStorage.getItem('chats') || '[]') || []
    localStorage.removeItem('chats')
    for (let index = 0; index < this._history_chats.length; index++) {
      const temp = this._history_chats[index]
      console.log('[ temp ] >', temp)
      this._append_char(false, temp.type, temp.data || '')
    }
  },
  // 初始化机器人
  init(config) {
    this._el = config.el || '#chat-box'
    this._isonline = config.online || false
    this._chat_container = document.querySelector(this._el)
    this._reply_input = document.querySelector('.js-reply')
    this._add_event()
    // 显示时间

    this._load()
    this._append_char(false, 'time')
  },
}

nil_robot.init({
  el: '#chart-box',
  online: false,
})
