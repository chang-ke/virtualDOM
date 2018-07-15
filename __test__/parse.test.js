import {parse} from '../src';

test('parse test', () => {
  expect(parse('<div id="test">test<img data-src="./1.jpg"/></div>')).toStrictEqual({
    type: 'div',
    props: {id: 'test'},
    children: [{text: 'test'}, {type: 'img', props: {'data-src': './1.jpg'}, children: []}],
  });
});

test('parse failed', () => {
  expect(parse('<div id="test">test<img data-src="./1.jpg"/>')).toThrowError('parse failed');
});
