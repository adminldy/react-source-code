import {createUnit} from './unit'
import {createElement} from './element'
let React = {
  rootIndex: 0,
  render
}

// 此元素可能是一个文本节点，DOM节点，或者自定义组件Counter
function render(element, container) {
  // container.innerHTML = `<span data-reactid="${React.rootIndex}">${element}</span>`
  // unit单元就是用来负责渲染的，负责把元素转换成页面上显示的html字符串
  let unit = createUnit(element)
  let markUp = unit.getMarkUp(React.rootIndex) // 用来返回HTML标记
  container.innerHTML = markUp
}

export default React