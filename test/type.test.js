import {
  max,
  min,
  regex,
  length,
  isOptional,
  isArrayElement,
} from '../src/type';

it('Test max()', () => {
  const value = 2;
  // max of value is 3
  expect(max(value, 3)).toBe(true);

  // max of value is 2
  expect(max(value, 2)).toBe(true);

  // max of value is 1, value = 2 so return false
  expect(max(value, 1)).toBe(false);
});

it('Test min()', () => {
  const value = 2;
  // min of value is 3
  expect(min(value, 1)).toBe(true);

  // min of value is 2
  expect(min(value, 2)).toBe(true);

  // min of value is 3, value = 2 so return false
  expect(min(value, 3)).toBe(false);
});

it('Test regex()', () => {
  expect(regex('123', /\d+/)).toBe(true);
  expect(regex('abc', /\d+/)).toBe(false);
});

it('Test length()', () => {
  // length great than or equal 0
  expect(length([], [0])).toBe(true);

  // length between 2 and 5
  expect(length('java', [2, 5])).toBe(true);
  expect(length('', [2, 5])).toBe(false);
});

it('Test isOptional()', () => {
  expect(isOptional()).toBe(true);
});

it('Test isArrayElement()', () => {
  expect(isArrayElement()).toBe(true);
});
