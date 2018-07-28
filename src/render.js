import diff from './diff';
import {isString, deepClone} from '../utils';

const ACTION = {
  update: 'update',
  replace: 'replace',
  remove: 'remove',
  insert: 'insert',
  move: 'move',
};

class Element {
  constructor({type, props = {}, children = null, text}) {
    this.type = type;
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
    return this._createElement(this.type, this.props, this.children, this.key, this.text);
  }

  clone() {
    return this.create();
  }

  _createElement(type, props, children, key, text) {
    let el;
    if (Array.isArray(children)) {
      el = document.createElement(type);
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
let index = 0;
function patch(node, patchs) {
  let changes = patchs[index];
  let childNodes = node && node.childNodes;
  if (!childNodes) index++;
  if (changes && changes.length && patchs[index]) {
    UpdateDom(node, changes);
  }
  let last = null;
  if (childNodes && childNodes.length) {
    childNodes.forEach((node, i) => {
      index = last && last.children ? index + last.children.length + 1 : index + 1;
      patch(node, patchs);
      last = node;
    });
  }
  index = 0;
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
          node.childNodes[index] && node.childNodes[index].remove();
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
    }, Object.create(null));

    if (prevDOM == null) {
      let el = new Element(vDOM).create();
      root.appendChild(el);
    } else {
      let patchs = diff(prevDOM, {
        type: root.tagName,
        props,
        children: [vDOM],
      });
      console.log(patchs, prevDOM, vDOM);
      patch(root, patchs);
    }

    prevDOM = {
      type: root.tagName,
      props,
      children: [vDOM],
    };
  };
})();
