import React from './react'
import {createElement} from './element'
// jsx 浏览器不能识别和运行，要靠babel转化成javascript
function sayHello() {
  alert('Hello')
}
// let element = (
//   <button id="sayHello" style={{color: 'red', backgroundColor: 'green'}} onClick={sayHello}>
//     say
//     <b>
//       Hello
//     </b>
//   </button>
// )
let element = createElement('button', {id: 'sayHello', style: {color: 'red', backgroundColor: 'green'}, onClick: sayHello},
 'say', createElement('b', {}, 'Hello')
 ) // 虚拟DOM DOM-DIFF
//  <button id="sayHello" style="color: red;background-color: 'green'" onclick="sayHello()">
//   <span>say</span>
//   <b>Hello</b>  
//  </button>
 // {type: 'button', props: {id: 'sayHello'}}
React.render(element, document.getElementById('root'))