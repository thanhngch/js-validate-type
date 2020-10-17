import {
  isNumber,
  isBoolean,
  isString,
  isFunction,
  isSymbol,
  isObject,
  isArray,
  isNaN,
  isNull,
  isUndefined,
  isInteger,
  isEmptyObject,
  isEmptyArray,
  isPromise,
  isRegex,
  isBigInt,
} from '../src/util';

it('Test isNumber()', () => {
  expect(isNumber(1)).toBe(true);
  expect(isNumber('1')).toBe(false);
});

it('Test isBoolean()', () => {
  expect(isBoolean(true)).toBe(true);
  expect(isBoolean(1)).toBe(false);
});

it('Test isString()', () => {
  expect(isString('')).toBe(true);
  expect(isString(1)).toBe(false);
  // eslint-disable-next-line no-new-wrappers
  expect(isString(new String())).toBe(false);
});

it('Test isFunction()', () => {
  expect(isFunction(() => {})).toBe(true);
  // eslint-disable-next-line prefer-arrow-callback
  expect(isFunction(function a() {})).toBe(true);
  expect(isFunction(1)).toBe(false);
});

it('Test isSymbol()', () => {
  expect(isSymbol(Symbol('1'))).toBe(true);
  expect(isSymbol(1)).toBe(false);
});

it('Test isObject()', () => {
  expect(isObject({})).toBe(true);
  expect(isObject([])).toBe(false);
});

it('Test isArray()', () => {
  expect(isArray([])).toBe(true);
  expect(isArray({})).toBe(false);
});

it('Test isNaN()', () => {
  expect(isNaN(NaN)).toBe(true);
  expect(isNaN(1)).toBe(false);
});

it('Test isNull()', () => {
  expect(isNull(null)).toBe(true);
  expect(isNull(undefined)).toBe(false);
  expect(isNull(1)).toBe(false);
});

it('Test isUndefined()', () => {
  expect(isUndefined(undefined)).toBe(true);
  expect(isUndefined(null)).toBe(false);
});

it('Test isInteger()', () => {
  expect(isInteger(1)).toBe(true);
  expect(isInteger(1.1)).toBe(false);
});

it('Test isEmptyObject()', () => {
  expect(isEmptyObject({})).toBe(true);
  expect(isEmptyObject({ a: 1 })).toBe(false);
  expect(isEmptyObject([])).toBe(false);
});

it('Test isEmptyArray()', () => {
  expect(isEmptyArray([])).toBe(true);
  expect(isEmptyArray([1])).toBe(false);
  expect(isEmptyArray({})).toBe(false);
});

it('Test isPromise()', () => {
  expect(isPromise(new Promise((_resolve, _reject) => {}))).toBe(true);
  expect(isPromise(1)).toBe(false);
});

it('Test isRegex()', () => {
  expect(isRegex(/\d/)).toBe(true);
});

it('Test isBigInt()', () => {
  // eslint-disable-next-line no-undef
  expect(isBigInt(BigInt(1))).toBe(true);
  expect(isBigInt(1)).toBe(false);
});
