import {deepClone, isAlpha, isSpace, isString} from '../utils';

test('deepClone {a: NaN, b: [null, 2], c: {s: "test", d: undefined}, e: new Date("2018-07-15")}', () => {
  expect(deepClone({a: NaN, b: [null, 2], c: {s: 'test', d: undefined}, e: new Date('2018-07-15')})).toStrictEqual({
    a: NaN,
    b: [null, 2],
    c: {s: 'test', d: undefined},
    e: new Date('2018-07-15'),
  });
});

test('isalpha test', () => {
  expect(isAlpha('a')).toBe(true);
  expect(isAlpha('1')).toBe(true);
  expect(isAlpha('A')).toBe(true);
  expect(isAlpha('$')).toBe(false);
});

test('isSpace test', () => {
  expect(isSpace(' ')).toBe(true);
  expect(isSpace('\n')).toBe(true);
  expect(isSpace('s')).toBe(false);
});

test('isString test', () => {
  expect(isString('test')).toBe(true);
  expect(isString('\n')).toBe(true);
  expect(isString({})).toBe(false);
  expect(isString(1)).toBe(false);
});
