import {
  Type,
  string,
  number,
  func,
  composeTypeToArray,
} from '../src/type';

it('Test composeTypeToArray function', () => {
  const type = composeTypeToArray(number | string | func);
  expect(type.length).toBe(3);
  expect(type.indexOf(number) > -1).toBe(true);
  expect(type.indexOf(string) > -1).toBe(true);
  expect(type.indexOf(func) > -1).toBe(true);
});

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
