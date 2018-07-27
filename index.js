import {Parse, Render} from './src';

try {
  let count = 0;
  let html = `<div class="=>"><div key="2">2333<button id="btn">点我</button></div><a href="https://www.baidu.com">百度</a></div>`;
  let virtualDOM = Parse(html); //document.getElementsByClassName('panel')[0].outerHTML
  console.log(virtualDOM);
  console.log(Parse(document.getElementsByClassName('panel')[0].outerHTML));
  Render(document.querySelector('#root'), virtualDOM);

  document.querySelector('#btn').onclick = function() {
    count++;
    let DOM = Parse(
      `<div><div>${2333 +
        count}<button id="btn">点我</button></div><a href="https://www.google.com">谷歌</a><div>你点了${count}次</div></div>`
    );
    Render(document.querySelector('#root'), DOM);
  };
} catch (err) {
  console.error(err);
}
