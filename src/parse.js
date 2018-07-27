import tokenizer from './tokenizer';
import {Stack, deepClone} from '../utils';

let startTagReg = /(?<=<)[0-9a-z]+/;
let propsReg = /[\w-]+\s*=\s*("|')[^\1]*\1/g;
let endTagReg = /[0-9a-z]+/;
let stack = new Stack();
let selfCloseTag = [
  ...'meta,base,br,hr,img,input,col,frame,link,command'.split(','),
  ...'area,param,object,embed,keygen,source,track,wbr'.split(','),
];

function buildVirtualDOM(virtualDOM, dom) {
  if (stack.len === 0) {
    virtualDOM = dom;
  } else {
    let vnode = virtualDOM;
    for (let i = 1; i < stack.len; ++i) {
      vnode = vnode.children[vnode.children.length - 1];
    }
    vnode.children.push(dom);
  }
  return virtualDOM;
}

function parse(html) {
  let tokens = tokenizer(html);
  let virtualDOM = [];
  /**利用栈先进后出的特性判断标签嵌套是否闭合 */
  tokens.forEach(vnode => {
    if (vnode.type === 'startTag') {
      let tag = vnode.val.match(startTagReg)[0];
      let props = vnode.val.match(propsReg) || [];
      vnode.type = tag;
      vnode.children = [];
      vnode.props = props.reduce((prev, curr) => {
        let key = curr.match(/[\w-]+/)[0];
        let val = curr.match(/(?<=("|'))[^\1]*(?=\1)/)[0];
        if (key === 'key') {
          vnode.key = val;
          return prev;
        }
        prev[key] = val;
        return prev;
      }, Object.create(null));

      virtualDOM = buildVirtualDOM(virtualDOM, vnode);
      if (!selfCloseTag.includes(tag)) {
        stack.push(tag);
      }
      delete vnode.val;
    }
    if (vnode.type === 'endTag') {
      let tag = vnode.val.match(endTagReg)[0];
      vnode.type = tag;
      if (tag === stack.last) {
        stack.pop();
      }
      vnode.close = true;
      delete vnode.val;
    }
    if (vnode.type === 'text') {
      virtualDOM = buildVirtualDOM(virtualDOM, {text: vnode.val});
    }
    return vnode;
  });
  if (stack.len) {
    stack.clear();
    throw new SyntaxError('parse failed');
  }
  return virtualDOM;
}

export default parse;
