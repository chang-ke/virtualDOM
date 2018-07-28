import {Parse, Render, diff} from './src';

try {
  let count = 0;
  let vdom = Parse(`<div class="=>">
                      <div key="2">
                        2333
                        <button id="btn">点我</button>
                      </div>
                      <a href="https://www.baidu.com">百度</a>
                    </div>`);

  Render(document.querySelector('#root'), vdom);
  dfs(vdom, vdom);
  document.querySelector('#btn').onclick = function() {
    count++;
    let DOM = Parse(
      `<div>
        <div>
          ${2333 + count}
          <button id="btn">点我</button>
        </div>
        <a href="https://www.google.com">谷歌</a>
        <div>你点了${count}次</div>
      </div>`
    );
    console.log(diff(vdom, vdom));
    //Render(document.querySelector('#root'), DOM);
  };
} catch (err) {
  console.error(err);
}

function dfs(oldVnode, newVnode) {
  console.log(oldVnode, newVnode);
  if (newVnode.children) {
    for (let i = 0; i < newVnode.children.length; ++i) {
      dfs(oldVnode.children[i], newVnode.children[i]);
    }
  }
}
