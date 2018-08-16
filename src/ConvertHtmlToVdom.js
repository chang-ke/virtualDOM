import tokenizer from './tokenizer';
import {Stack, deepClone} from '../utils';

const startTagReg = /(?<=<)[0-9a-z]+/;
const propsReg = /[\w\-]+\s*=\s*("|')[^\1]*?\1/g;
const endTagReg = /[0-9a-z]+/;
const stack = new Stack();
const selfCloseTag = [
  ...'meta,base,br,hr,img,input,col,frame,link,command'.split(','),
  ...'area,param,object,embed,keygen,source,track,wbr'.split(','),
];

function buildVtree(vtree, vdom) {
  if (stack.len === 0) {
    vtree = vdom;
  } else {
    let vnode = vtree;
    for (let i = 1; i < stack.len; ++i) {
      vnode = vnode.children[vnode.children.length - 1];
    }
    vnode.children.push(vdom);
  }
  return vtree;
}

function parse(html) {
  let tokens = tokenizer(html);
  let vtree = [];
  /**利用栈先进后出的特性判断标签嵌套是否闭合 */
  tokens.forEach(vnode => {
    if (vnode.type === 'startTag') {
      let tagName = vnode.val.match(startTagReg)[0];
      let props = vnode.val.match(propsReg) || [];
      vnode.tagName = tagName;
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

      vtree = buildVtree(vtree, vnode);
      if (!selfCloseTag.includes(tagName)) {
        stack.push(tagName);
      }
      delete vnode.val;
      delete vnode.type;
    }
    if (vnode.type === 'endTag') {
      let tag = vnode.val.match(endTagReg)[0];
      vnode.tagName = tag;
      if (tag === stack.last) {
        stack.pop();
      }
      vnode.close = true;
      delete vnode.val;
      delete vnode.type;
    }
    if (vnode.type === 'text') {
      vtree = buildVtree(vtree, {text: vnode.val});
    }
    return vnode;
  });
  if (stack.len) {
    stack.clear();
    throw new SyntaxError('parse failed');
  }
  return vtree;
}

export default parse;
