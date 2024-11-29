import {
  Type,
  isArray,
  isArrayElement,
  isFixedArrayElement,
  isString,
  number,
  string,
} from '../src/type';

it('Test isString', () => {
    const Person = new Type([[isString]]);
  
    const me = 'Harry Porter';
  
    const errors = Person.validate(me);
    expect(isArray(errors)).toBe(true);
    expect(errors.length).toBe(0);
});

it('Test fixed array', () => {
    const isEndsWith = (value: string, endString: string) => isString(value) && value.endsWith(endString);

    const Person = new Type({
      books: [[isFixedArrayElement(string, number, [[isEndsWith, ['@gmail.com']]])]],
    });
  
    const me = {
      books: ['Harry Porter', 1984, 'harry@gmail.com'],
    };
  
    const errors = Person.validate(me);
    expect(isArray(errors)).toBe(true);
    expect(errors.length).toBe(0);
});

it('Test fixed array', () => {
  const isEndsWith = (value: string, endString: string) => isString(value) && value.endsWith(endString);

  const isCustomArray = (_: null, __: null, arrayValue: Array<any>) => {
    return (
      arrayValue.length === 3
      && new Type(string).check(arrayValue[0])
      && new Type(number).check(arrayValue[1])
      && new Type([[isEndsWith, ['@gmail.com']]]).check(arrayValue[2])
    );
  };
  
  const Person = new Type({
    books: [[isArrayElement], [isCustomArray]],
  });

  const me = {
    books: ['Harry Porter', 1984, 'harry@gmail.com'],
  };

  const errors = Person.validate(me);
  console.log(errors);
  expect(isArray(errors)).toBe(true);
  expect(errors.length).toBe(0);
});
