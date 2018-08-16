import diff from './diff';
import {isString, deepClone} from '../utils';

const ACTION = {
  update: 'update',
  replace: 'replace',
  remove: 'remove',
  insert: 'insert',
  append: 'append',
  move: 'move',
};

class Element {
  constructor({tagName, props = {}, children = null, text}) {
    this.tagName = tagName;
    this.props = props;
    this.children = children;
    this.key = null;
    this.text = text;
    if (text) this.key = text;
    if ('key' in props) {
      this.key = props.key;
    }
  }

  create() {
    return this._createElement(this.tagName, this.props, this.children, this.key, this.text);
  }

  clone() {
    return this.create();
  }

  _createElement(tagName, props, children, key, text) {
    let el;
    if (Array.isArray(children)) {
      el = document.createElement(tagName);
      for (const key in props) {
        el.setAttribute(key, props[key]);
      }
      children.forEach(child => {
        el.appendChild(new Element(child).create());
      });
    } else {
      el = document.createTextNode(text);
    }
    return el;
  }
}

function patch(node, patchs) {
  let walker = {index: 0};
  dfs(node, patchs, walker);
}

function dfs(node, patchs, walker) {
  let index = walker.index++;

  node.childNodes.forEach(child => {
    dfs(child, patchs, walker);
  });

  if (patchs[index]) {
    patchs[index].forEach(patch => {
      let {type, props, vnode, text} = patch;
      switch (type) {
        case ACTION.update:
          props.forEach(prop => {
            if ('value' in prop) {
              node.setAttribute(prop.key, prop.value);
            } else {
              node.removeAttribute(prop.key);
            }
          });
          break;
        case ACTION.replace:
          node.replaceWith(new Element(vnode).create());
          break;
        case ACTION.append:
          node.appendChild(new Element(vnode).create());
          break;
        case ACTION.remove:
          node.removeChild(node.childNodes[patch.index]);
          break;
        case ACTION.move:
          let fromNodeClone = node.childNodes[patch.from].cloneNode(true);
          let toNodeClone = node.childNodes[patch.to].cloneNode(true);
          console.log(fromNodeClone, node.childNodes[patch.to]);
          node.replaceChild(fromNodeClone, node.childNodes[patch.to]);
          node.replaceChild(toNodeClone, node.childNodes[patch.from]);
          break;
      }
    });
  }
}

function UpdateDom(node, changes, nochild) {
  if (changes) {
    changes.forEach(change => {
      let {props, type, index, vnode} = change;
      switch (type) {
        case ACTION.update:
          props.forEach(prop => {
            if ('value' in prop) {
              node.setAttribute(prop.key, prop.value);
            } else {
              node.removeAttribute(prop.key);
            }
          });
          break;
        case ACTION.remove:
          node.childNodes[index].remove();
          break;
        case ACTION.insert:
          node.insertBefore(new Element(vnode).create(), node.childNodes[index]);
          break;
        case ACTION.replace:
          node.parentNode.replaceChild(new Element(vnode).create(), node);
          break;
        case ACTION.move:
          let fromNodeClone = node.childNodes[change.from].clone(true);
          let toNodeClone = node.childNodes[change.to].clone(true);
          node.replaceChild(fromNodeClone, node.childNodes[change.to]);
          node.replaceChild(toNodeClone, node.childNodes[change.from]);
          break;
      }
    });
  }
}

export default (function Render() {
  let prevDOM = null;
  return function(root, vDOM) {
    let props = Array.from(root.attributes).reduce((prev, curr) => {
      prev[curr.name] = curr.value;
      return prev;
    }, Object.create(null));

    let newVDOM = {
      tagName: root.localName,
      props,
      children: [vDOM],
    };
    if (prevDOM == null) {
      let el = new Element(vDOM).create();
      root.appendChild(el);
    } else {
      let patchs = diff(prevDOM, newVDOM);
      console.log(patchs);
      patch(root, patchs);
    }
    prevDOM = newVDOM;
  };
})();
