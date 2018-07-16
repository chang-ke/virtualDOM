const DOCTYPE = /^<!DOCTYPE [^>]+>/i;

function tokenizer(html) {
  let token = '';
  let tokens = [];
  html = html.replace(/<!--(.|\s)*?-->/gm, '').replace(DOCTYPE, '');

  while (html.length) {
    /** 匹配开始标签*/
    if (html[0] === '<' && html[1] !== '/') {
      let index = 0;
      while (html[index] !== '>') {
        if (html[index] === '"' || html[index] === "'") {
          let quote = html[index]; /**判断引号 */
          do {
            token += html[index];
            index++;
          } while (html[index] !== quote);
        }
        token += html[index];
        index++;
      }
      token += html[index];
      tokens.push({
        type: 'startTag',
        val: token,
      });
    } else if (html[0] !== '<') {
      /**匹配文本*/
      let index = 0;
      while (html[index] !== '<') {
        token += html[index];
        index++;
      }
      if (token.trim()) {
        tokens.push({
          type: 'text',
          val: token,
        });
      }
    } else if (html[0] === '<' && html[1] === '/') {
      /**匹配结束标签*/
      let index = 0;
      while (html[index] !== '>' && index < html.length - 1) {
        token += html[index];
        index++;
      }
      token += html[index];
      tokens.push({
        type: 'endTag',
        val: token,
      });
    }
    html = html.slice(token.length);
    token = '';
  }
  return tokens;
}

export default tokenizer;
