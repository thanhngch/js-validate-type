import {
  Type,
  isArray,
} from '../src/type';

it('Test array', () => {
  class Person {
    constructor(name) {
      this.name = name;
    }
  }

  const NewType = new Type({
    bestFriend: Object,
    age: Number,
    myFriends: [Person],
  });

  const me = {
    bestFriend: new Person('Hana'),
    // eslint-disable-next-line no-new-wrappers
    age: new Number(123),
    myFriends: [new Person('John'), new Person('Peter')],
  };

  const errors = NewType.validate(me);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});
