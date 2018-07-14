import {isString, deepClone} from '../utils/index.js';
let data = {
  handleClick: function() {
    console.log(11);
  },
};
class Element {
  constructor({type, props, children}) {
    this.type = type;
    this.props = props;
    this.children = children;
    this.key = null;
    if ('key' in props) {
      this.key = props.key;
    }
  }

  create() {
    return this._createElement(this.type, this.props, this.key);
  }

  clone() {
    return this.create();
  }

  _updateProps(el, props = {}, oldProps = {}) {
    Object.keys(oldProps).forEach(key => {
      if (!props[key]) {
        el.removeAttribute(key);
      }
    });
    Object.keys(props).forEach(key => el.setAttribute(key, props[key]));
  }

  _createElement(type, props, key) {
    let el = document.createElement(type);
    for (const key in props) {
      if (/on[A-Z]{1}[a-zA-Z]+$/.test(key)) {
        el[key.toLowerCase()] = data[props[key]];
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, props[key]);
      }
    }
    return el;
  }
}

function updateProps(el, props = {}, oldProps = {}) {
  Object.keys(oldProps).forEach(key => {
    if (!props[key]) {
      el.removeAttribute(key);
    }
  });
  Object.keys(props).forEach(key => {
    if (/on[A-Z]{1}[a-zA-Z]+$/.test(key)) {
      el[key.toLowerCase()] = data[props[key]];
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, props[key]);
    }
  });
}

function render() {
  let prev;
  let first = false;
  return function(root, originVirtualDOM) {
    //只有一个节点
    let virtualDOM = deepClone(originVirtualDOM);
    if (virtualDOM.children.length === 0) {
      root.replaceChild(new Element(virtualDOM).create(), prev.native);
    }
    function dfs(parent, virtualDOM, prev = {}) {
      let el;
      if (virtualDOM.type) {
        if (prev.native && prev.type === virtualDOM.type) {
          el = prev.native;
          updateProps(el, virtualDOM.props, prev.props);
        } else {
          el = new Element(virtualDOM).create();
        }
        if (virtualDOM.children.length) {
          renderChildren(el, virtualDOM.children, prev.children);
        }
      } else if ('text' in virtualDOM) {
        el = document.createTextNode(virtualDOM.text);
      }
      virtualDOM.native = el;
      return virtualDOM;
    }

    function renderChildren(parent, children = [], prevChildren = []) {
      children.forEach((child, index) => {
        let prevChild = prevChildren[index];
        if (prevChild) {
          let el = dfs(parent, child, prevChild);
          if (prevChild.type !== child.type || child.text !== prevChild.text) {
            parent.replaceChild(el.native, prevChild.native);
          }
          if (child.type === prevChild.type) {
            updateProps(prevChild.native, child.props, prevChild.props);
          }
        } else {
          let el = dfs(parent, child);
          parent.appendChild(el.native);
        }
      });

      if (Array.isArray(prevChildren)) {
        prevChildren.slice(children.length).forEach(child => {
          parent.removeChild(child.native);
        });
      }
    }

    dfs(root, virtualDOM, prev);
    prev = virtualDOM;
    if (!first) {
      first = true;
      root.appendChild(prev.native);
    }
  };
}

export default {render: render()};
