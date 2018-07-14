export class Stack {
  constructor() {
    this.arr = [];
  }
  push(val) {
    this.arr.push(val);
  }
  pop() {
    return this.arr.pop();
  }
  clear() {
    this.arr = [];
  }
  get last() {
    return this.arr[this.arr.length - 1];
  }
  get len() {
    return this.arr.length;
  }
}

export function isAlpha(c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
}

export function isSpace(c) {
  return /\s/gm.test(c);
}

export function isString(s) {
  return typeof s === 'string';
}

export function deepClone(origin) {
  let target = {};
  let toString = Object.prototype.toString;
  Object.keys(origin).forEach(key => {
    if (toString(origin[key]) === '[object Object]') {
      target[key] = deepClone(origin[key]);
    } else if (toString.call(origin[key]) === '[object Array]') {
      target[key] = origin[key].map(val => {
        return deepClone(val);
      });
    } else if (toString.call(origin[key]) === '[object Date]') {
      target[key] = new Date(origin[key].toUTCString());
    } else {
      target[key] = origin[key];
    }
  });
  return target;
}
