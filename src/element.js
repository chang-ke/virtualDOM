import { isString } from '../utils/index.js';

class Element {
  constructor({ type, props, children }) {
    this.type = type;
    this.props = props;
    this.children = children;
    this.key = null;
    if ('key' in props) {
      this.key = props.key;
    }
  }
  
  static render(root, virtualDOM) {
    if (!root instanceof HTMLElement) {
      throw new TypeError(`${root} must be a HTMLElement`);
    }
    let el = null;
    if (Array.isArray(virtualDOM)) {
      virtualDOM.forEach(dom => {
        if (isString(dom)) {
          el = document.createTextNode(dom);
        } else {
          el = new Element(dom).create();
          Element.render(el, dom.children);
        }
        root.appendChild(el);
      });
    } else {
      if (isString(virtualDOM)) {
        el = document.createTextNode(virtualDOM);
      } else {
        el = new Element(virtualDOM).create();
        Element.render(el, virtualDOM.children);
      }
      root.appendChild(el);
    }
    return el;
  }

  create() {
    return this._createElement(this.type, this.props, this.children, this.key);
  }

  clone() {
    return this.create();
  }
  
  _createElement(type, props, children, key) {
    let el = document.createElement(type);
    for (const key in props) {
      const val = props[key];
      el.setAttribute(key, val);
    }
    return el;
  }
}

export default Element;
