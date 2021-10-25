import {Element, createElement} from './element'
import $ from 'jquery'
class Unit {
  constructor(element) {
    // 挂载到私有属性上的都以_开头
    this._currentElement = element
  }
  getMarkUp() {
    throw Error('此方法不能被调用')
  }
}

class TextUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid
    return `<span data-reactid="${reactid}">${this._currentElement}</span>`
  }
}
// {type: 'button', props: {id: 'sayHello', onClick: sayHello, style: {color: 'red'}}, children: ['say', {type: 'b', {}, 'hello'}]}
//  <button id="sayHello" style="color: red;background-color: 'green'" onclick="sayHello()">
//   <span>say</span>
//   <b>Hello</b>  
//  </button>
class NativeUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid
    let {type, props} = this._currentElement
    let tagStart = `<${type} data-reactid="${this._reactid}"`
    let childString = ''
    let tagEnd = `</${type}>`
    for(let propName in props) {
      if(/^on[A-Z]/.test(propName)) { // 这说明要绑定事件了
        let eventName = propName.slice(2).toLowerCase() // 获取事件名  click
        $(document).delegate(`[data-reactid="${this._reactid}"]`, `${eventName}.${this._reactid}`, props[propName])
      }else if(propName === 'style') { // 如果是一个样式对象

        let styleObj = props[propName]
        let styles = Object.entries(styleObj).map(([attr, value]) => {
          attr = attr.replace(/[A-Z]/g, function(matched) {
            return `-${matched.toLowerCase()}`
          }) // replace方法返回一个新的字符串
          return `${attr}:${value}`
        }).join(';')
        tagStart += (` style="${styles}"`)

      }else if(propName === 'children') {

        let children = props[propName]
        children.forEach((child, index) => {
         let childUnit = createUnit(child) // 可能是一个字符中， 也可以也是一个react元素
         let childMarkUp = childUnit.getMarkUp(`${this._reactid}.${index}`)
         childString += childMarkUp
        })

      }else if(propName === 'className'){ // 如果是一个类名的话
        tagStart += (` class="${props[propName]}"`)
      }else {
        tagStart += (` ${propName}=${props[propName]} `) // 比如说id
      }
    }
    return tagStart + '>' + childString + tagEnd
  }
}
// 
function createUnit(element) {
  console.log(element instanceof Element)
  if(typeof element === 'string' || typeof element === 'number') {
    return new TextUnit(element)
  }
  
  if(element instanceof Element && typeof element.type === 'string'){
    return new NativeUnit(element)
  }
}

export {
  createUnit
}