import {ConvertHtmlToVdom} from '../src/index';

test('ConvertHtmlToVdom test', () => {
  expect(
    ConvertHtmlToVdom('<div id="test">test<div class = "wrapper" ><img data-src="./1.jpg"/></div>  </div>')
  ).toStrictEqual({
    type: 'div',
    props: {id: 'test'},
    children: [
      {text: 'test'},
      {type: 'div', props: {class: 'wrapper'}, children: [{type: 'img', props: {'data-src': './1.jpg'}, children: []}]},
    ],
  });
});

test('ConvertHtmlToVdom failed', () => {
  expect(() =>
    ConvertHtmlToVdom('<div id="test" key="test">test<span><i></i></span><img data-src="./1.jpg"/>')
  ).toThrowError('parse failed');
});
