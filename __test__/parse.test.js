import {Parse} from '../src/index';

test('Parse test', () => {
  expect(Parse('<div id="test">test<div class = "wrapper" ><img data-src="./1.jpg"/></div>  </div>')).toStrictEqual({
    type: 'div',
    props: {id: 'test'},
    children: [
      {text: 'test'},
      {type: 'div', props: {class: 'wrapper'}, children: [{type: 'img', props: {'data-src': './1.jpg'}, children: []}]},
    ],
  });
});

test('Parse failed', () => {
  expect(() => Parse('<div id="test">test<span><i></i></span><img data-src="./1.jpg"/>')).toThrowError('Parse failed');
});
