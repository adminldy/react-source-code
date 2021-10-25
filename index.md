#### 手写React源码

1. 首先准备React.render方法 
   
```js
import {createUnit} from './unit.js'
import {createElement} from './element.js'
// 此元素可能是一个文本节点，DOM节点，或者自定义组件Counter
function render(element, container) {
  // container.innerHTML = `<span data-reactid="${React.rootIndex}">${element}</span>`
  // unit单元就是用来负责渲染的，负责把元素转换成页面上显示的html字符串
  let unit = createUnit(element)
  let markUp = unit.getMarkUp(React.rootIndex) // 用来返回HTML标记
  container.innerHTML = markUp
}

export default render
```
2. 准备unit单元

```js
class Unit { // 定义父类 方便子类继承
  constructor(element) {
    this._currentElement = element // 把element存起来
  }
  getMarkUp() {
    throw Error('此方法不能被调用')
  }
}

class TextUnit extends Unit{
  getMarkUp(reactid) { // 获取html标记
    this._reactid = reactid
    return `<span data-react-id=${reactid}>${this._currentElement}</span>`
  }
}

function createUnit(element) {
  // 如果是element是字符串或者是数字类型 那么return 一个TextUnit实例
  if(typeof element === 'string' || typeof element === 'number') {
    return new TextUnit(element)
  }
  
}
```
3. 处理createElement

```js
// 虚拟dom
class Element {
  constructor(type, props) {
    this.type = type
    this.props = props
  }
}

function createElement(type, props = {}, children) {
  props.children = children ? children : []
  return new Element(type, props)
}

export {
  Element,
  createElement
}
```
4. 在index.js中准备jsx

```js
import React from './react'
// jsx 浏览器不能识别和运行，要靠babel转化成javascript
function sayHello() {
  alert('Hello')
}
// Jsx
let element = (
  <button id="sayHello" style={{color: 'red', backgroundColor: 'green'}} onClick={sayHello}>
    say
    <b>
      Hello
    </b>
  </button>
)

// 由babel 👉 React.createElement格式 并且生成虚拟dom
 let element = React.createElement('button', {id: 'sayHello', style: {color: 'red', backgroundColor: 'green'}, onClick: sayHello},
 'say', React.createElement('b', {}, 'Hello')
 ) // 虚拟DOM DOM-DIFF

// 由虚拟dom转化成真实dom
 <button id="sayHello" style="color: red;background-color: 'green'" onclick="sayHello()">
  <span>say</span>
  <b>Hello</b>  
 </button>

React.render(element, document.getElementById('root'))
```
5. 处理虚拟dom
  
```js
 // 判断是不是createElement出的虚拟dom实例 是的话return 一个处理虚拟dom的类实例
if(element instanceof Element && typeof element.type === 'string'){
    return new NativeUnit(element)
  }

class NativeUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid
    let {type, props} = this._currentElement
    let tagStart = `<${type}`
    let childString = ''
    let tagEnd = `</${type}>`
    for(let propName in props) {
      if(/^on[A-Z]/.test(propName)) { // 绑定事件
        
      }else if(propName === 'style') { // 如果是一个样式对象

      }else if(propName === 'children') {

      }else {
        tagStart += (` ${propName}=${props[propName]}`)
      }
    }
    return tagStart + '>' + childString + tagEnd
  }
}
```