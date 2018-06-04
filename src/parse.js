import { Stack, isAlpha, isSpace, deepClone } from '../utils/index.js';

function Tiger() {
  const unCloseTag = ['img', 'input', 'br', 'link', 'meta'];
  const stack = new Stack();
  let html = '';
  let index = 0;
  let virtualDOM = {};
  let virtualDOMTree = [];

  function parse(_html) {
    //去掉注释
    html = _html.replace(/<!--(.|\s)*?-->/gm, '');
    let startText = html.match(/(.|\s)*?</)[0].slice(0, -1);
    if (startText.replace(/\s/gm, '')) virtualDOMTree.push(startText);

    for (; index < html.length; ++index) {
      if (html[index] === '<' && (index += 1)) {
        if (isAlpha(html[index])) {
          let type = getStartTag(),
            props = getProps(type),
            text = getText();
          let dom = { type, props, children: [] };
          if (stack.len === 0) {
            virtualDOMTree.push(dom);
            virtualDOM = Object.assign({}, dom);
            if (text) {
              unCloseTag.includes(type) ? virtualDOMTree.push(text) : dom.children.push(text);
            }
          } else {
            let newVirtualDOM = virtualDOM;
            for (let index = 1; index < stack.len; ++index) {
              newVirtualDOM = newVirtualDOM.children[newVirtualDOM.children.length - 1];
            }
            // s指向要push的对象
            newVirtualDOM.children.push(dom);
            if (!unCloseTag.includes(type)) {
              let children = newVirtualDOM.children[newVirtualDOM.children.length - 1].children;
              if (text) children.push(text);
            } else {
              if (text) newVirtualDOM.children.push(text);
            }
            // 获取修改对象的引用，vdom
            virtualDOM = deepClone(virtualDOM);
          }
          //自闭合标签不加入栈
          if (!unCloseTag.includes(type)) {
            stack.push(type);
          }
        } else {
          getEndTag();
          let text = html.substr(index).match(/>(.|\s)*?</m);
          let newVirtualDOM = virtualDOM;
          for (let index = 1; index < stack.len; ++index) {
            newVirtualDOM = newVirtualDOM.children[newVirtualDOM.children.length - 1];
          }
          //获得标签结尾文本
          if (text && text[0].trim() && text[0].slice(1, -1).trim()) {
            text = text[0].slice(1, -1);
            if (stack.len === 0) {
              virtualDOMTree.push(text);
            } else {
              newVirtualDOM.children.push(text);
            }
          } else if (!text) {
            //最后一个结尾标签的文本
            text = html.substr(index + 1).trim();
            text && virtualDOMTree.push(text);
          }

          virtualDOM = deepClone(virtualDOM);
        }
      }
    }
    return virtualDOMTree;
  }
  function getStartTag() {
    let type = '';
    while (html[index] !== '>' && !isSpace(html[index])) {
      if (html[index] === '/') {
        index++;
        continue;
      }
      type += html[index];
      index += 1;
    }
    return type.trim();
  }
  function getProps(type) {
    let props = {},
      name = '',
      val = '';
    while (html[index] !== '>') {
      while (html[index] === ' ') {
        index++;
      }
      // 自闭合标签或者是普通标签无属性
      if (html[index] === '/' || html[index] === '>') {
        html[index] === '/' && index++;
        return props;
      }
      while (html[index] !== '=') {
        if (html[index - 1] === ' ') {
          if (name) {
            props[name] = name.trim();
            name = '';
          }
        }
        name += html[index];
        index++;
      }
      if (html[index + 1] !== '"') {
        throwError('Syntax', index + 1);
      }
      index += 2;
      while (html[index] !== '"') {
        val += html[index];
        index++;
        if (index === html.length) {
          throwError('Syntax', index);
        }
      }
      index++;
      props[name] = val;
      name = val = '';
    }
    return props;
  }
  function getEndTag() {
    let type = '';
    while (html[index] !== '>') {
      if (isAlpha(html[index])) {
        type += html[index];
      }
      index += 1;
    }
    // console.log(stack.last, type);
    if (unCloseTag.includes(stack.last)) {
      return stack.pop();
    }
    // 遇到自闭合标签直接跳过
    if (type !== stack.pop()) {
      throwError('Syntax', index);
    }
  }
  function getText() {
    let text = '';
    while (html[index + 1] !== '<') {
      index += 1;
      text += html[index];
    }
    return text.trim() ? text : '';
  }

  function throwError(type, len) {
    let row = 0,
      col = 0;
    for (let index = 0; index < len; ++index) {
      if (html[index] === '\n') {
        col = 0;
        row++;
      } else {
        col++;
      }
    }
    switch (type) {
      case 'Syntax':
        throw new SyntaxError(`Syntax in position (${row},${col})`);
        break;
      case 'Ivalid':
        throw new SyntaxError(`ivalid type in position (${row}, ${col})`);
    }
  }
  return { parse };
}

export default Tiger;
