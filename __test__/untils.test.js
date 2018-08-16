import {deepClone, isAlpha, isSpace, isString, deepEqual} from '../utils';

test('deepClone test', () => {
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

test('deepEqual test', () => {
  let a = {
    a: undefined,
    b: NaN,
    c: [1, 2, {a: 1}],
    d: '',
    e: 's45d',
    f: null,
    g: {},
  };
  let b = {
    a: undefined,
    b: NaN,
    c: [1, 2, {a: 1}],
    d: '',
    e: 's45d',
    f: null,
    g: {},
  };

  expect(deepEqual(a, b)).toBe(true);
  expect(deepEqual('a', 1)).toBe(false);
  expect(deepEqual(0, 1)).toBe(false);
  expect(deepEqual({a: ''}, {})).toBe(false);
  expect(deepEqual({a: {b: 1}}, {a: {b: 2}})).toBe(false);
});
