import Lexical from './src/parse.js';
import Element from './src/element.js';

try {
  let lex = new Lexical();
  let vitrualDOM = lex.parse(document.getElementsByClassName('panel')[0].outerHTML);
  console.log(vitrualDOM);
  Element.render(document.querySelector('#root'), vitrualDOM);
} catch (err) {
  console.error(err);
}
