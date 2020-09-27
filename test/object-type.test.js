import {
  Type,
  string,
  number,
  optional,
} from '../src/type';

import {
  isArray,
} from '../src/util';

it('Test object', () => {
  const Person = new Type({
    name: string,
    age: number,
  });

  const me = {
    name: 'Peter',
    age: 23,
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test object optional', () => {
  const Person = new Type({
    name: string,
    age: optional | number,
  });

  const me = {
    name: 'Peter',
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);

  // key of me is name
  expect(Object.keys(me).length).toBe(1);
});

it('Test object Type in Type', () => {
  const Books = new Type([string]);

  const Person = new Type({
    name: string,
    books: Books,
  });

  const me = {
    name: 'Peter',
    books: ['Code complete', 'The clean coder'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test empty object', () => {
  const Person = new Type({});

  const me = {};

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});
