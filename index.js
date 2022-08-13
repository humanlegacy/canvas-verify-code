export default class CanvasVerifyCode {

  constructor(node, options) {
    this.events = {}
    this.options = {
      // 验证码宽度
      width: 120,

      // 验证码高度
      height: 60,

      // 验证码字体
      codeFont: '30px impact',

      // 验证码类型   
      // calc：验证码为计算公式
      // code：验证码为数字大小写字母组合
      codeType: 'code',

      // 验证码长度
      codeLength: 6,

      // 验证码大小写是否敏感
      strict: true,

      // 验证码计算范围
      calcRange: [10, 20],

      // 验证码计算符号
      calcSymbol: ['+', '-', '*'],

      // 背景干扰线数量
      lineCount: 5,

      // 自定义参数覆盖
      ...options
    }

    // 创建canvas对象
    var canvas = document.createElement('canvas');
    node.appendChild(canvas)
    canvas.width = this.options.width;
    canvas.height = this.options.height;

    // 获取canvas画布
    this.ctx = canvas.getContext('2d');

    // 执行绘制
    this.display()

    canvas.addEventListener('click', () => {
      this.display()
    }, false)
  }

  emit(event, ...args) {
    const handlers = this.events[event]
    if (!handlers) {
      return
    }
    for (let handler of handlers) {
      handler.apply(this, args)
    }
  }

  on(event, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Event handler should be a function')
    }
    if (this.events[event]) {
      this.events[event].push(handler)
    } else {
      this.events[event] = [handler]
    }
  }


  display() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.options.width, this.options.height);

    // 绘制验证码背景
    this.drawLine();

    // 绘制验证码
    this.drawCode()

    this.emit('onRefresh', this.verifyResult)
  }


  // 绘制验证码
  drawCode() {
    // 定义验证码属性
    this.ctx.font = this.options.codeFont
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';

    // 绘制验证码
    let code = this.createCode()
    for (let i = 0; i < this.options.codeLength; i++) {
      this.ctx.save()
      this.ctx.fillStyle = this.randomColor()
      this.ctx.translate((i + 0.2) * this.options.width / this.options.codeLength, this.getRandom([this.options.height * 0.3, this.options.height * 0.7]))
      this.ctx.rotate(this.getRandom([-30, 30]) * Math.PI / 180)
      this.ctx.fillText(code[i], 0, 0);
      this.ctx.restore()
    }
  }


  // 画线
  drawLine() {
    for (var i = 0; i < this.options.lineCount; i++) {
      let start = [-this.options.width / 2, this.options.width * 1.5]
      let end = [-this.options.height / 2, this.options.height * 1.5]

      this.ctx.lineWidth = this.getRandom([1, 3])
      this.ctx.strokeStyle = this.randomColor()
      this.ctx.beginPath();
      this.ctx.moveTo(this.getRandom(start), this.getRandom(end));
      this.ctx.lineTo(this.getRandom(start), this.getRandom(end));
      this.ctx.stroke();
    }
  }

  // 生成验证码
  createCode() {
    // 验证码为数字字符串
    if (this.options.codeType === 'code') {

      // 验证码验证字段
      const verifyResult = this.getString({ length: this.options.codeLength })

      // 验证码大小写敏感
      this.verifyResult = this.options.strict ? verifyResult : verifyResult.toLocaleLowerCase()

      // 返回给canvas绘制
      return verifyResult
    }

    // 验证码为计算公式
    const SUB = this.getRandom(this.options.calcRange),
      SUM = this.getArray(this.options.calcSymbol),
      MIN = this.getRandom(this.options.calcRange)

    // 验证码验证字段
    this.verifyResult = eval(SUB + SUM + MIN);

    // 返回给canvas绘制
    return SUB + (SUM == '*' ? 'x' : SUM) + MIN;
  }

  /**
  * 生成指定范围内的随机数
  * 
  * @param {array} [min,max] 数组包含最大值和最小值
  * @return {number}
  */
  getRandom([min = 0, max = 0]) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * 返回随机生成指定长度的数字字母组合
   * 
   * @param {number} length 生成的字符串长度 
   * @param {string} str 指定参与生成的字符串
   * @param {string} split 分隔位数
   * @param {string} join 分隔符 
   * @return {string}
   */
  getString({ length, str = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789', split = 0, join = '-' }) {
    let string = ''
    for (let i = 0; i < length; i++) {
      if (split > 0 && i !== 0 && i % split === 0) {
        string += join
      }
      string += str[this.getRandom([0, str.length - 1])]
    }
    return string
  }

  isArray(o) {
    if (!Array.isArray) {
      Array.isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
      };
    }
    return Array.isArray(o)
  }

  //随机获取数组中某一项
  getArray(arr) {
    if (!this.isArray(arr)) throw new Error('argument must be an Array')
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // 生成随机色
  randomColor() {
    return `#${((Math.random() * (0xFFFFFF).toString(10)).toString(16)).slice(-6)}`
  }


}