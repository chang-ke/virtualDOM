import {tokenizer} from '../src/index';

test('tokenizer test <div id="test">test<img/></div>', () => {
  expect(tokenizer('<div id="test">test<img/></div>')).toStrictEqual([
    {type: 'startTag', val: '<div id="test">'},
    {type: 'text', val: 'test'},
    {type: 'startTag', val: '<img/>'},
    {type: 'endTag', val: '</div>'},
  ]);
});
