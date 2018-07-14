import tokenizer from './tokenizer';
import {Stack, deepClone} from '../utils/index';

let startTagReg = /[0-9a-z]+\s?/;
let propsReg = /([0-9a-zA-Z]|-)+\s*=\s*(("(.|\s)*?")|('(.|\s)*?'))/g;
let endTagReg = /[0-9a-zA-Z]+/;
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
  tokens.forEach(token => {
    if (token.type === 'startTag') {
      let tag = token.val.match(startTagReg)[0].trim();
      let props = token.val.match(propsReg);
      let o = {};
      token.type = tag;
      token.children = [];
      if (props) {
        props.forEach(prop => {
          let key = prop.split('=')[0].trim();
          let val = prop
            .split('=')[1]
            .trim()
            .slice(1, -1);
          o[key] = val;
        });
      }
      token.props = o;
      virtualDOM = buildVirtualDOM(virtualDOM, token);
      if (!selfCloseTag.includes(tag)) {
        stack.push(tag);
      }
      delete token.val;
    }
    if (token.type === 'endTag') {
      let tag = token.val.match(endTagReg)[0];
      token.type = tag;
      if (tag === stack.last) {
        stack.pop();
      }
      token.close = true;
      delete token.val;
    }
    if (token.type === 'text') {
      virtualDOM = buildVirtualDOM(virtualDOM, {text: token.val});
    }
    return token;
  });
  if (stack.len) {
    throw new SyntaxError('匹配失败');
  }
  return virtualDOM;
}

export default parse;
