## canvas验证码

### 属性
```js
// 验证码宽度
width: 120

// 验证码高度
height: 60

// 验证码字体
codeFont: '30px impact'

// 验证码类型   
// calc：验证码为计算公式
// code：验证码为数字大小写字母组合
codeType: 'code'

// 验证码长度
codeLength: 6

// 验证码大小写是否敏感
strict: true

// 验证码计算范围
calcRange: [10, 20]

// 验证码计算符号
calcSymbol: ['+', '-', '*']

// 背景干扰线数量
lineCount: 5
```
### 方法
```js
// 重绘验证码
verify.display()
```

### 订阅事件
```js
verify.on('onRefresh', (verifyResult) => {
  // 更新验证后的验证值
  console.log(verifyResult)
})
```

### 用例
```bash
# 安装依赖
npm i canvas-verify-code
```
```html
<span id="verify"></span>
```
```js
import CanvasVerifyCode from 'canvas-verify-code'

const verify = new CanvasVerifyCode(document.getElementById('verify'), {
  ... 
  // 自定义参数
})
// 首次返回实例对象
console.log(verify.verifyResult)
```