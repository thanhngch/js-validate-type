// node -r esm example/test3.js
import Type, { string, Self } from '../src/type.js'
// const Person = new Type({
//   name: string,
//   friend: Self,
// });
// const me = {
//   name: 'Peter',
//   friend: {
//     name: 'Bod',
//     friend: {
//       name: 'John',
//     }
//   }
// };
// const errors = Person.validate(me);
// console.log(Person.schema);
// console.log(errors);

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