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
  return /\s/gim.test(c);
}

export function isString(s) {
  return typeof s === 'string';
}

export function deepClone(o) {
  let obj = {};
  let toString = Object.prototype.toString;
  Object.keys(o).forEach(key => {
    if (toString[o[key]] === '[object Object]') {
      obj[key] = deepClone(o[key]);
    } else if (toString[o[key]] === '[object Array]') {
      obj[key] = [...o[key]];
    } else if (toString[o[key]] === '[object Date]') {
      obj[key] = new Date(o[key].toUTCString());
    } else {
      obj[key] = o[key];
    }
  });
  return obj;
}
