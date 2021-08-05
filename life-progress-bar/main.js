let life = {
  input_brithday: '',
  // 最终寿命(人生平均寿命)
  end_years_old: 80,
  // 用户生日
  brithday: new Date(),
  now_time: new Date(),

  $brithday_inp: document.getElementById('brithday_inp'),

  $brithday: document.querySelector('.js-brithday'),
  $life_go_years: document.querySelector('.js-life-go-years'),
  $today_go_hour: document.querySelector('.js-today-go-hour'),
  $week_go_day: document.querySelector('.js-week-go-day'),
  $month_go_day: document.querySelector('.js-month-go-day'),
  $year_go_month: document.querySelector('.js-year-go-month'),

  $life_go_years_bar: document.querySelector('.js-life-go-years-bar'),
  $today_go_hour_bar: document.querySelector('.js-today-go-hour-bar'),
  $week_go_day_bar: document.querySelector('.js-week-go-day-bar'),
  $month_go_day_bar: document.querySelector('.js-month-go-day-bar'),
  $year_go_month_bar: document.querySelector('.js-year-go-month-bar'),
  // 获取本月有多少天
  getMonthDay() {
    let days = new Date(
      this.now_time.getFullYear(),
      this.now_time.getMonth() + 1,
      0
    ).getDate()
    return days
  },
  compareDate(date1, date2) {
    var oDate1 = new Date(date1)
    var oDate2 = new Date(date2)
    if (oDate1.getTime() > oDate2.getTime()) {
      return 1
    } else if (oDate1.getTime() < oDate2.getTime()) {
      return -1
    } else {
      return 0
    }
  },
  dateFormat(fmt, date) {
    let ret;
    const opt = {
      "Y+": date.getFullYear().toString(), // 年
      "m+": (date.getMonth() + 1).toString(), // 月
      "d+": date.getDate().toString(), // 日
      "H+": date.getHours().toString(), // 时
      "M+": date.getMinutes().toString(), // 分
      "S+": date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
    return fmt;
  },
  lifeGoYears() {
    const now_years = this.now_time.getFullYear()
    const brithday_years = this.brithday.getFullYear()
    const go_years = now_years - brithday_years
    this.$life_go_years_bar.style.width = `${
      (go_years / this.end_years_old) * 100
    }%`
    this.$life_go_years.innerHTML = go_years
  },
  todayGoHour() {
    const now_hour = this.now_time.getHours()
    this.$today_go_hour.innerHTML = now_hour
    this.$today_go_hour_bar.style.width = `${(now_hour / 24) * 100}%`
  },
  weekGoDay() {
    const now_day = this.now_time.getDay()
    this.$week_go_day.innerHTML = now_day
    this.$week_go_day_bar.style.width = `${(now_day / 7) * 100}%`
  },
  monthGoDay() {
    const now_day = this.now_time.getDate()
    this.$month_go_day.innerHTML = now_day
    this.$month_go_day_bar.style.width = `${
      (now_day / this.getMonthDay()) * 100
    }%`
    return now_day - 1
  },
  yearGoMonth() {
    const now_month = this.now_time.getMonth()
    this.$year_go_month.innerHTML = now_month
    this.$year_go_month_bar.style.width = `${(now_month / 12) * 100}%`
  },
  rander() {
    this.now_time = new Date()
    this.brithday = new Date(this.input_brithday)
    this.$brithday.innerHTML = this.input_brithday

    console.log(this.now_time)
    console.log(this.brithday)
    this.lifeGoYears()
    this.todayGoHour()
    this.weekGoDay()
    this.monthGoDay()
    this.yearGoMonth()
  },
  initEvent() {
    this.$brithday_inp.onchange = () => {
      if (this.compareDate(this.$brithday_inp.value,new Date().toLocaleDateString()) == 1) {
        alert("时间不对哟")
      }else{
        this.input_brithday = this.$brithday_inp.value
        localStorage.setItem("dirthday", this.input_brithday)
        this.rander()
      }
    }
  },
  initData() {
    const birthday = localStorage.getItem("dirthday") || new Date("2000").toLocaleDateString()
    this.$brithday_inp.value = this.dateFormat("YYYY-mm-dd",new Date(birthday))
    this.input_brithday = birthday;
  },
  init() {
    this.initData()
    this.initEvent()
    this.rander()
  },
}
life.init()
