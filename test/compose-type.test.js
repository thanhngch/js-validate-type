import {
  Type,
  string,
  number,
} from '../src/type';

it('Test number|string', () => {
  const Person = new Type({
    height: number | string,
  });

  const me = {
    height: '170cm',
  };
  const myFriend = {
    height: 172,
  };

  const meErrors = Person.validate(me);
  expect(meErrors.length).toBe(0);

  const friendErrors = Person.validate(myFriend);
  expect(friendErrors.length).toBe(0);
});
