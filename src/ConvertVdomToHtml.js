const selfCloseTag = [
  ...'meta,base,br,hr,img,input,col,frame,link,command'.split(','),
  ...'area,param,object,embed,keygen,source,track,wbr'.split(','),
];

export default function convertVdomToHtml(vdom) {
  let html = '';
  (function dfs({tagName, props, children, text}) {
    if (text) {
      html += text;
    } else {
      let isClose = selfCloseTag.includes(tagName);
      let propStr = '';
      Object.keys(props).forEach(key => {
        propStr += ` ${key}="${props[key]}"`;
      });
      html += `<${tagName}${propStr}${isClose ? '/' : ''}>`;
      children.forEach(child => {
        dfs(child);
      });
      if (!isClose) html += `</${tagName}>`;
    }
  })(vdom);
  return html;
}
