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
  if (origin === null) {
    return null;
  }
  if (typeof origin === 'undefined') {
    return undefined;
  }
  if (typeof origin === 'number' && origin !== origin) {
    return NaN;
  }

  if (typeof origin === 'string' || typeof origin === 'number') {
    return origin;
  }

  Object.keys(origin).forEach(key => {
    if (toString.call(origin[key]) === '[object Object]') {
      target[key] = deepClone(origin[key]);
    } else if (Array.isArray(origin[key])) {
      target[key] = origin[key].map(val => {
        return deepClone(val);
      });
    } else if (toString.call(origin[key]) === '[object Date]') {
      target[key] = new Date(origin[key].toUTCString());
    } else {
      target[key] = deepClone(origin[key]);
    }
  });
  return target;
}
