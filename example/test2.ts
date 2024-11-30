// bun example/test2.js
import Type, {
  isArrayElement
} from '../src/type.ts';
import { isNumber, isString } from '../src/util.ts';

const isPositive = (value) => value > 0;

const isStringOrNumber = (value) => isNumber(value) || isString(value);

const isArrayLengthGreatThan5 = (value, params, arr) => {
  return arr.length > 5;
}
const arrayValidate = (_, __, arr) => {
  return arr.length === 2 && isString(arr[0]) && isNumber(arr[1]);
};

const PersonType = new Type({
  profile: [[isArrayElement], [arrayValidate]]
});

const person = {
  profile: ['a', '1']
};

const errors = PersonType.validate(person);
console.log('Error:', errors);

try {
  PersonType.assert(person);
} catch(error) {
  console.error('Error:', error.message);
}

