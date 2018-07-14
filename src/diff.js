export default function diff() {}

const roki = function() {
  let oldvnode;

  return {
    h,
    render,
  };

  function isString(s) {
    return typeof s === 'string';
  }

  function h(type, props = {}, children = []) {
    children = children.map(child => {
      if (isString(child)) return createTextVNode(child, void 0);
      return child;
    });
    return createVNode(type, props, props.key, children, void 0);
  }

  function patch(oldvnode = {}, vnode) {
    let element;
    if (vnode.type) {
      if (oldvnode && oldvnode.type === vnode.type) {
        element = oldvnode.dom;
        updateProps(element, vnode.props, oldvnode.props);
      } else {
        element = createElement(vnode.type, vnode.props);
      }
      vnode.children && patchChildren(oldvnode.children, vnode.children, element);
    } else if (vnode.text) {
      if (oldvnode.text) {
        element = oldvnode.dom;
        if (vnode.text !== oldvnode.text) element.nodeValue = vnode.text;
      } else {
        element = createTextNode(vnode.text);
      }
    }
    vnode.dom = element;
    return vnode;
  }

  function patchChildren(oldChildren = [], children = [], parentElement) {
    children.forEach((child, index) => {
      let oldChild = null;
      if (oldChildren) oldChild = oldChildren[index];
      if (oldChild) {
        let newNode = patch(oldChild, child);
        if (oldChild.type !== child.type) {
          replaceChild(parentElement, oldChild.dom, newNode.dom);
        }
      } else {
        let newNode = patch(undefined, child);
        appendChild(parentElement, newNode.dom);
      }
    });

    oldChildren.slice(children.length).forEach(child => removeChild(parentElement, child.dom));
  }

  function render(vnode, container) {
    vnode = patch(oldvnode, vnode);
    if (!oldvnode) appendChild(container, vnode.dom);
    oldvnode = vnode;
  }

  function createVNode(type, props, key, children, dom) {
    return {
      type,
      children,
      props,
      dom,
      key,
    };
  }

  function createTextVNode(text, dom) {
    return {
      text,
      dom,
    };
  }

  function removeChild(element, child) {
    element.removeChild(child);
  }

  function appendChild(element, child) {
    element.appendChild(child);
  }

  function replaceChild(element, oldChild, newChild) {
    element.replaceChild(newChild, oldChild);
  }

  function createElement(tag, props = {}) {
    const element = document.createElement(tag);
    updateProps(element, props);
    return element;
  }

  function updateProps(element, props = {}, oldProps = {}) {
    Object.keys(oldProps)
      .filter(key => !key.startsWith('on'))
      .forEach(key => {
        element.removeAttribute(key);
      });

    Object.keys(oldProps)
      .filter(key => key.startsWith('on'))
      .forEach(key => {
        const eventType = key.toLowerCase().substring(2);
        element.removeEventListener(eventType, oldProps[key]);
      });

    Object.keys(props)
      .filter(key => !key.startsWith('on'))
      .forEach(key => {
        element.setAttribute(key, props[key]);
      });

    Object.keys(props)
      .filter(key => key.startsWith('on'))
      .forEach(key => {
        const eventType = key.toLowerCase().substring(2);
        element.addEventListener(eventType, props[key]);
      });
  }

  function createTextNode(text) {
    return document.createTextNode(text);
  }
};
