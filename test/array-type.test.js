import {
  Type,
  string,
} from '../src/type';

import {
  isArray,
} from '../src/util';

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
