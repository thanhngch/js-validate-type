// bun example/test3.js
import Type, { Self, string } from '../src/type';

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
console.log(Person.schema);
console.log(errors);