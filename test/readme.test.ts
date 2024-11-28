// test example in readme
import {
  array,
  integer,
  isArray,
  isArrayElement,
  isNumber,
  isOptional,
  isString,
  length,
  min,
  number,
  optional,
  Self,
  string,
  Type,
} from '../src/type';

it('Test example', () => {
  const Person = new Type({
    name: string,
    books: [string],
  });

  const me = {
    name: 'Peter',
    books: ['Code complete', 'The clean coder'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 1', () => {
  const Age = new Type(number);
  const age = 23;

  const errors = Age.validate(age); // no errors
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 2', () => {
  const Person = new Type({
    name: string,
    age: integer,
    height: number,
    friends: array,
    books: optional,
  });

  const me = {
    name: 'Peter',
    age: 23,
    height: 175.0,
    friends: ['Tom'],
  };

  const errors = Person.validate(me); // no errors
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 3', () => {
  const Person = new Type({
    height: number | string,
  });

  const me = {
    height: '170cm',
  };
  const myFriend = {
    height: 172,
  };

  const meErrors = Person.validate(me); // no errors
  expect(isArray(meErrors)).toBe(true);
  expect(meErrors.length).toBe(0);

  const friendErrors = Person.validate(myFriend); // no errors
  expect(isArray(friendErrors)).toBe(true);
  expect(friendErrors.length).toBe(0);
});

it('Test example 4', () => {
  const Person = new Type({
    gender: [['male', 'female']],
    age: [[10, 12, 15]],
  });
  const me = {
    gender: 'male',
    age: 12,
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 5', () => {
  const isEmail = (value: string) => isString(value) && /\S+@\S+\.\S+/.test(value);
  const isEndsWith = (value: string, endString: string) => value.endsWith(endString);

  const Person = new Type({
    email: [[isEmail]],
    email2: [[isEmail], [isEndsWith, 'gmail.com']],
  });

  const me = {
    email: 'peter@gmail.com',
    email2: 'peter2@gmail.com',
  };

  // it will call isEndsWith('peter2@gmail.com', 'gmail.com'); -> true

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 6', () => {
  const Person = new Type({
    age: [[min, 10]],

    // name is string with length great than 2
    name: [[isString], [length, [2]]],

    // books is array with array length from 2 to 10
    books: [[isArray], [length, [2, 10]]],
  });

  const me = {
    age: 23,
    name: 'Peter',
    books: ['Code complete', 'The clean coder'],
  };

  const errors = Person.validate(me); // no errors
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 7', () => {
  const Person = new Type({
    // books is array of string
    books: [string],
  });

  const me = {
    books: ['Code complete', 'The clean coder'],
  };

  const errors = Person.validate(me); // no errors
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 8', () => {
  const Person = new Type({
    // books is array of string same as `books: [string]`
    books: [[isArrayElement], [isString]],
  });

  const me = {
    books: ['Code complete', 'The clean coder'],
  };

  const errors = Person.validate(me); // no errors
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 9', () => {
  // fist and second parameter is null
  // only using arrayValue
  // eslint-disable-next-line arrow-body-style
  const isCustomArray = (_: null, __: null, arrayValue: Array<any>) => {
    return (
      arrayValue.length === 2
      && isString(arrayValue[0])
      && isNumber(arrayValue[1])
    );
  };

  const Person = new Type({
    devices: [[isArrayElement], [isCustomArray]],
  });

  const me = {
    devices: ['iPhone', 2],
  };
  const errors = Person.validate(me); // no errors
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 10', () => {
  const Person = new Type({
    name: string,
    age: number,
    gender: string | optional,
    friends: [
      {
        name: string,
      },
    ],
    email: {
      default: string,
      others: [[isOptional], [isArrayElement], [isString]],
    },
  });

  const me = {
    name: 'Peter',
    age: 23,
    friends: [
      {
        name: 'John',
      },
      {
        name: 'Bob',
      },
    ],
    email: {
      default: 'peter@gmail.com',
    },
  };

  const errors = Person.validate(me); // no error
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 11', () => {
  const Books = new Type([string]); // type Books

  const Person = new Type({
    name: string,
    books: Books, // using type Books
  });

  const me = {
    name: 'Peter',
    books: ['Code complete', 'The clean coder'],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 12', () => {
  const Person = new Type({
    name: string,
    friends: [Self],
  });
  const me = {
    name: 'Peter',
    friends: [
      {
        name: 'Bod',
      },
      {
        name: 'Ana',
        friends: [
          {
            name: 'John',
          },
        ],
      },
    ],
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 12.1', () => {
  const Person = new Type({
    name: string,
    bestFriend: Self,
  });

  const me = {
    name: 'Peter',
    bestFriend: {
      name: 'Ana',
      bestFriend: {
        name: 'John',
      },
    },
  };
  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test example 13', () => {
  const Person = new Type({
    name: string,
    age: number,
    gender: string | optional,
    friends: [
      {
        name: string,
      },
    ],
    email: {
      default: string,
      others: [[isOptional], [isArrayElement], [isString]],
    },
  });

  const me = {
    name: 'Peter',
    age: 23,
    email: {},
  };

  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(2); // 2 errors
});

it('Test example 14', () => {
  const Person = new Type({
    name: string,
  });

  const me = {
    name: 12,
  };

  expect(Person.assert.bind(Person, me)).toThrow(Error);
});
