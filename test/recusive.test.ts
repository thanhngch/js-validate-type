import {
  Self,
  Type,
  isArray,
  string,
} from '../src/type';

it('Test recusive object', () => {
  const Person = new Type({
    name: string,
    friend: Self,
  });
  const me = {
    name: 'Peter',
    friend: {
      name: 'Bod',
      friend: {
        name: 'John',
      },
    },
  };
  const errors = Person.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});

it('Test recusive array', () => {
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
