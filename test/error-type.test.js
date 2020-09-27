import {
  Type,
  string,
  integer,
  isArrayElement,
} from '../src/type';

import {
  isArray, isString,
} from '../src/util';

it('Test condition regex function error', () => {
  const A = new Type([[isArrayElement], [isString]]);

  const a = ['1', '2', 3];

  const errors = A.validate(a);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe(3); // 3 is error type
});

it('Test error with condition function', () => {
  const Person = new Type({
    books: [[isString]],
  });

  const me = {
    books: 123,
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('books');
});

it('Test error in array', () => {
  const Person = new Type({
    books: [[1, 2, 3]],
  });

  const me = {
    books: 4,
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('books');
});

it('Test type not support', () => {
  const Person = new Type({
    books: [string, integer], // this type not support
  });

  const me = {
    books: ['Code complete'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('books');
});

it('Test value is not array', () => {
  const Person = new Type({
    books: [[isArrayElement], [isString]],
  });

  const me = {
    books: 'Code complete',
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('books');
});

it('Test value of array is not validate with function', () => {
  const Person = new Type({
    books: [[isArrayElement], [isString]],
  });

  const me = {
    books: [123],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('books');
});

it('Test value is not array', () => {
  const Person = new Type({
    books: '1', // type not found
  });

  const me = {
    books: 'Code complete',
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('books');
});

it('Test assert function', () => {
  const Person = new Type({
    books: [string],
  });

  const me = {
    books: 1,
  };
  expect(Person.assert.bind(Person, me)).toThrow(Error);
});

it('Test assert function success', () => {
  const Person = new Type({
    books: [string], // type not found
  });

  const me = {
    books: ['Code complete'],
  };
  expect(Person.assert.bind(Person, me)).not.toThrow(Error);
});

it('Test array with condition has parameter is array', () => {
  const isLengthGreatThan1 = (_, __, arrayValue) => arrayValue.length > 1;

  const Person = new Type({
    name: string,
    books: [[isArrayElement], [isLengthGreatThan1]],
  });

  const me = {
    name: 'John',
    books: ['Code complete'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('books');
});

it('Test error key path', () => {
  const Person = new Type({
    profile: {
      name: string,
    },
  });

  const me = {
    profile: {
      name: 1,
    },
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('profile.name');
});

it('Test not found key', () => {
  const Person = new Type({
    profile: {
      name: string,
    },
  });

  const me = {}; // not found profile

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('profile');
});

it('Test empty type', () => {
  const Person = new Type({});

  const me = {
    profile: {
      name: 'John',
    },
  }; // not found profile

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(1);
  expect(errors[0].key).toBe('profile');
});
