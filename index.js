import {ConvertHtmlToVdom, ConvertVdomToHtml, Render, diff} from './src';
import {deepEqual} from './utils';

try {
  let count = 0;
  let vdom = ConvertHtmlToVdom(`<div class="5">
                      <div key="2">
                        2333
                        <button id="btn" key="5" data-key="5">点我</button>
                      </div>
                      <a href="https://www.baidu.com" key="3">百度</a>
                    </div>`);

  Render(document.querySelector('#root'), vdom);
  console.log(vdom);
  console.log(ConvertVdomToHtml(vdom));
  document.querySelector('#btn').onclick = function() {
    count++;
    let DOM = ConvertHtmlToVdom(
      `<div id="s">
        <div key="2">
          ${2333 + count}
          <button id="btn" key="5">点我</button>
        </div>
        <a href="https://www.google.com" key="3">谷歌</a>
       
      </div>` //<div>你点了${count}次</div>
    );
    Render(document.querySelector('#root'), DOM);
  };
} catch (err) {
  console.error(err);
}
