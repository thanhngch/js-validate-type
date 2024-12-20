// bun example/test4.js
// test class
import Type from '../src/type';

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
};

const PersonType = new Type({
  bestFriend: Object,
  age: Number,
  myFriends: [Person],
});

const me = {
  bestFriend: new Person('Hana'), // instanceof class Object
  age: new Number(123), // instanceof class Number
  myFriends: [new Person('John'), new Person('Peter')],
};

const errors = PersonType.validate(me); // no errors
console.log(errors);
