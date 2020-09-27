import {
  Type,
  string,
  number,
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
