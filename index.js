import Tiger from './src/parse.js';
import Element from './src/element.js';
try {
  let Lexical = new Tiger();
  let vitrualDOM = Lexical.parse(document.getElementsByClassName('panel')[0].outerHTML);
  console.log(vitrualDOM);
  Element.render(document.querySelector('#root'), vitrualDOM);
} catch (err) {
  console.error(err);
}
