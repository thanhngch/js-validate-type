import {
  Type,
  max,
  min,
  length,
} from '../src/type';

import {
  isArray,
} from '../src/util';

it('Test condition in array function', () => {
  // check age only in 10, 12 or 15
  const Person = new Type({
    age: [[10, 12, 15]],
  });
  const me = {
    age: 12,
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test condition max and min function', () => {
  const Person = new Type({
    age: [[max, 40], [min, 15]],
  });

  const me = {
    age: 20,
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test condition length function', () => {
  // check length of string and array
  // length bettwen 2 and 5
  const Person = new Type({
    name: [[length, [2, 5]]],
    books: [[length, [2, 5]]],
  });

  const me = {
    name: 'Peter',
    books: ['Harry Porter', 'The Old Man and the Sea'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});
