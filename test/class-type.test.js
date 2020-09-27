import { Type, string } from '../src/type';
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

