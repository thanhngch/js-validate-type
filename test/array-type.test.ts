import {
  Type,
  isArray,
  isArrayElement,
  isOptional,
  isString,
  string,
} from '../src/type';

it('Test array', () => {
  const Person = new Type({
    name: string,
    books: [string],
  });

  const me = {
    name: 'Peter',
    books: ['Harry Porter', '1984'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test array with condition', () => {
  const Person = new Type({
    name: string,
    books: [[isArrayElement], [isString]],
  });

  const me = {
    name: 'Peter',
    books: ['learn javascript in 24 hours'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test array optional with condition', () => {
  const Person = new Type({
    name: string,
    books: [[isOptional], [isArrayElement], [isString]],
  });

  const me = {
    name: 'Peter',
  };

  const friend = {
    name: 'John',
    books: ['Code complete'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);

  const errorsFriend = Person.validate(friend);
  expect(isArray(errorsFriend)).toBe(true);
  expect(errorsFriend.length).toBe(0);
});

it('Test array with condition has parameter is array', () => {
  const isLengthGreatThan1 = (_: null, __: null, arrayValue: string | Array<any>) => arrayValue.length > 1;

  const Person = new Type({
    name: string,
    books: [[isArrayElement], [isLengthGreatThan1]],
  });

  const me = {
    name: 'John',
    books: ['Code complete', 'The clean coder'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});
