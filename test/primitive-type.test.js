import {
  Type,
  string,
  number,
  boolean,
  integer,
  Null,
  Undefined,
  date,
  func,
  promise,
  optional,
} from '../src/type';

import {
  isArray,
} from '../src/util';

it('Test string', () => {
  const Pet = new Type(string);
  const pet = 'Kitty';

  const errors = Pet.validate(pet);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test error string', () => {
  const Pet = new Type(string);
  const pet = 2;

  const errors = Pet.validate(pet);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1); // one error
});

it('Test number', () => {
  const Age = new Type(number);
  const age = 23;

  const errors = Age.validate(age);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test boolean', () => {
  const A = new Type(boolean);
  const a = false;

  const errors = A.validate(a);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test integer', () => {
  const A = new Type(integer);
  const a = 123;

  const errors = A.validate(a);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test Null', () => {
  const A = new Type(Null);
  const a = null;

  const errors = A.validate(a);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test Undefined', () => {
  const A = new Type(Undefined);
  const a = undefined;

  const errors = A.validate(a);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test Date', () => {
  const A = new Type(date);
  const a = new Date();

  const errors = A.validate(a);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test func', () => {
  const A = new Type(func);
  const a = () => {};

  const errors = A.validate(a);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test promise', () => {
  const A = new Type(promise);
  const a = new Promise((_resolve, _reject) => {});

  const errors = A.validate(a);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test optional', () => {
  const A = new Type(optional);

  const a = undefined;
  expect(A.validate(a).length).toBe(0);

  const b = 123;
  expect(A.validate(b).length).toBe(0);
});
