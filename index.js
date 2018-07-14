import parse from './src/parse.js';
import T from './src/element.js';
import {deepClone} from './utils/index.js';
try {
  let html = `<div><div>2333<button id="btn">点我</button></div><a href="https://www.baidu.com">百度</a></div>`;
  let virtualDOM = parse(html); //document.getElementsByClassName('panel')[0].outerHTML
  console.log(virtualDOM);
  T.render(document.querySelector('#root'), virtualDOM);
  let count = 0;

  document.querySelector('#btn').onclick = function() {
    count++;
    let DOM = parse(
      `<div><div>${2333 +
        count}<button id="btn">点我</button></div><a href="https://www.google.com">谷歌</a><div>你点了${count}次</div></div>`
    );
    T.render(document.querySelector('#root'), DOM);
  };
} catch (err) {
  console.error(err);
}
