function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

function _deepClone(o) {
  let obj = {};
  let toString = Object.prototype.toString;
  Object.keys(o).forEach(key => {
    if (toString[o[key]] === '[object Object]') {
      obj[key] = _deepClone(o[key]);
    } else if (toString[o[key]] === '[object Array]') {
      obj[key] = [...o[key]];
    } else {
      obj[key] = o[key];
    }
  });
  return obj;
}
let a = {
  a: 5666,
  b: {
    c: [2, 2, 2, 3, 6, 6, 6, 9, 9],
    d: {
      f: {
        e: new Date()
      }
    }
  }
};
/**
 * window10 + node8.9.3 + i4700 + 8G
 * 可以看到通过递归遍历复制和通过JSON复制的效率差别非常大，后者比前者慢了5倍
 */
let t = new Date().getTime();
for (let i = 0; i < 10000000; ++i) {
  _deepClone(a); // 7516ms
}
console.log(new Date().getTime() - t);
t = new Date().getTime();
for (let i = 0; i < 10000000; ++i) {
  deepClone(a); // 48497ms
}
console.log(new Date().getTime() - t);
