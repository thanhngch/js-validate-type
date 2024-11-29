## About

Validate type in javascript in runtime. A lightweight, no-dependency library. It's ~320 line of code.

[![npm version](http://img.shields.io/npm/v/js-validate-type.svg?style=flat-square)](https://npmjs.org/package/js-validate-type)
[![GitHub license](https://img.shields.io/github/license/thanhngch/js-validate-type.svg)](https://github.com/thanhngch/js-validate-type/blob/master/LICENCE)
[![Build Status](http://img.shields.io/travis/thanhngch/js-validate-type.svg?style=flat-square)](https://travis-ci.org/thanhngch/js-validate-type)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Codecov](https://img.shields.io/codecov/c/github/thanhngch/js-validate-type.svg?style=flat-square)](https://codecov.io/gh/thanhngch/js-validate-type)

## Installation

`npm i js-validate-type --save`

## How to using

```js
import { Type, string } from 'js-validate-type';

const Person = new Type({
  name: string,
  books: [string],
});

const me = {
  name: 'Peter',
  books: ['Code complete', 'The clean coder'],
};

const errors = Person.validate(me);
// errors is []
```

## Simple types

Simple types are `optional`, `boolean`, `number`, `string`, `integer`, `Null`, `Undefined`,
`array`, `object`, `func` (function type), and `promise`.

Example 1

```js
const Age = new Type(number);
const age = 23;

const errors = Age.validate(age); // no errors
```

Example 2 test simple type with object

```js
import { Type, string } from 'js-validate-type';

const Person = new Type({
  name: string,
  age: integer,
  height: number,
  friends: array,
  books: optional,
});

const me = {
  name: 'Peter',
  age: 23,
  height: 175.0,
  friends: ['Tom'],
};

const errors = Person.validate(me); // no errors
```

## Union type

Using union type of simple types using `|`
Eg:
- `number | string | array`: number or string or array
- `string | optional`: is optional string

Example 3

```js
const Person = new Type({
  height: number | string,
});

const me = {
  height: '170cm',
};
const myFriend = {
  height: 172,
};

const meErrors = Person.validate(me); // no errors

const friendErrors = Person.validate(myFriend); // no errors
```

## Enum type

Using `[[enum of element]]` for enum type with format:

- `[[1,2,3]]` : value is 1, 2 or 3
- `[['male', 'female']]` : value is male or female

Note: type of element is `boolean`, `number`, `string`, `null`, `undefined` is support.

Example 4

```js
const Person = new Type({
  gender: [['male', 'female']],
  age: [[10, 12, 15]],
});
const me = {
  gender: 'male',
  age: 12,
};

const errors = Person.validate(me);
```

## Condition type

Using `[[conditionFunction]]` same as enum type, but `conditionFunction` is function return `true` for valid value.

- Condition function with pararmeter with format `[[ conditionFunction, param ]]`. Only one parameter is support.
- Multiple condition function is

```js
[
  [conditionFunction1, param],
  [conditionFunction2, param],
  ...
]
```

Example 5

```js
import { Type, isString } from 'js-validate-type';

const isEmail = (value) => isString(value) && /\S+@\S+\.\S+/.test(value);
const isEndsWith = (value, endString) => value.endsWith(endString);

const Person = new Type({
  email: [[isEmail]],
  email2: [[isEmail], [isEndsWith, 'gmail.com']],
});

const me = {
  email: 'peter@gmail.com',
  email2: 'peter2@gmail.com',
};

// it will call isEndsWith('peter2@gmail.com', 'gmail.com'); -> true

const errors = Person.validate(me); // no errors
```

## Build-in condition function

Build-in condition function include:

- `isOptional`
- `isObject`
- `isArray`
- `isBoolean`
- `isNumber`
- `isString`
- `isFunction`
- `isPromise`
- `isNull`
- `isUndefined`
- `isInteger`
  It will check type. And there are functions `max`, `min`, `regex`, `length` which define:

```js
export const max = (value, a) => a >= value;
export const min = (value, a) => a <= value;
export const regex = (value, regexExpress) => regexExpress.test(value);

export const length = (arrOrString, [a, b = Number.POSITIVE_INFINITY]) =>
  arrOrString.length >= a && arrOrString.length <= b;
```

Example 6

```js
import { Type, isString, isArray, min, length } from 'js-validate-type';

const Person = new Type({
  age: [[min, 10]],

  // name is string with length great than 2
  name: [[isString], [length, [2]]],

  // books is array with array length from 2 to 10
  books: [[isArray], [length, [2, 10]]],
});

const me = {
  age: 23,
  name: 'Peter',
  books: ['Code complete', 'The clean coder'],
};

const errors = Person.validate(me); // no errors
```

## Array type

Using `[elementType]` if all element has type `elementType`.
Example:

- `[string]` : array of string
- `[integer]` : array of string

Example 7

```js
const Person = new Type({
  // books is array of string
  books: [string],
});

const me = {
  books: ['Code complete', 'The clean coder'],
};

const errors = Person.validate(me); // no errors
```

## Check element type with condition in Array

### Using isArrayElement function

Using condition function `isArrayElement` to check element of array

Example 8
```js
import { Type, isString, isArrayElement } from 'js-validate-type';
const Person = new Type({
  // books is array of string same as `books: [string]`
  books: [[isArrayElement], [isString]],
});

const me = {
  books: ['Code complete', 'The clean coder'],
};

const errors = Person.validate(me); // no errors
```

Difference of `isArrayElement` and `isArray` is condition function in `isArrayElement` will call in every element.

### isArrayElement function and array check function

Array check function will call with 3 parameter and it's call once in array.

Example below will check array type `[string, number]`, that is first element is `string` and
second element is `number`:

```js
// Example 9
import { Type, isString, isArrayElement } from 'js-validate-type';

// fist and second parameter is null
// only using arrayValue
const isCustomArray = (_, __, arrayValue) => {
  return (
    arrayValue.length === 2
    && isString(arrayValue[0]) 
    && isNumber(arrayValue[1])
  );
};

const Person = new Type({
  devices: [[isArrayElement], [isCustomArray]],
});

const me = {
  devices: ['iPhone', 2],
};

const errors = Person.validate(me); // no errors
```

## Object type

Using object can compose other type.
Example 10:

```js
const Person = new Type({
  name: string,
  age: number,
  gender: string | optional,
  friends: [
    {
      name: string,
    },
  ],
  email: {
    default: string,
    others: [[isOptional], [isArrayElement], [isString]],
  },
});

const me = {
  name: 'Peter',
  age: 23,
  friends: [
    {
      name: 'John',
    },
    {
      name: 'Bob',
    },
  ],
  email: {
    default: 'peter@gmail.com',
  },
};

const errors = Person.validate(me); // no error
```

## Using Type in Type

Example 11
```js
const Books = new Type([string]); // type Books

const Person = new Type({
  name: string,
  books: Books, // using type Books
});

const me = {
  name: 'Peter',
  books: ['Code complete', 'The clean coder'],
};

const errors = Person.validate(me);
```

## Using recursive type

Using `Self` type for recusive object or recusive array.

Example 12

```js
import Type, { string, Self } from '../src/type.js';

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

const errors = Person.validate(me); // no errors
```

Example 12.1 for recusive object

```js
import Type, { string, Self } from '../src/type.js'
const Person = new Type({
  name: string,
  bestFriend: Self,
});

const me = {
  name: 'Peter',
  bestFriend: {
    name: 'Ana',
    bestFriend: {
      name: 'John',
    },
  },
};

const errors = Person.validate(me); // no errors
```

## Class validate

If type is function (or class) it will check with `instanceof` operator.

```js
import Type, { promise } from '../src/type.js';

class Person {
  constructor(name) {
    this.name = name;
  }
};

const PersonType = new Type({
  bestFriend: Object,
  age: Number,
  myFriends: [Person],
});

const me = {
  bestFriend: new Person('Hana'), // is instanceof class Object
  age: new Number(123), // is instanceof class Number
  myFriends: [new Person('John'), new Person('Peter')],
};

const errors = PersonType.validate(me); // no errors
```

## Error handle

Using `validate` function to show list all errors.
If it's no error it will return an empty array.
Otherwhise, it return error with format

```js
[
  {
    path: `key in object`,
    message: `message of error`,
  },
];
```

Example 13:

```js
const Person = new Type({
  name: string,
  age: number,
  gender: string | optional,
  friends: [
    {
      name: string,
    },
  ],
  email: {
    default: string,
    others: [[isOptional], [isArrayElement], [isString]],
  },
});

const me = {
  name: 'Peter',
  age: 23,
  email: null,
};

const errors = Person.validate(me);
// It return: [
//  {
//    key: 'email.default',
//    message: "'email.default' is not valid type"
//  },
//  { 
//    key: 'friends',
//    message: "value of 'friends' is not array" 
//  }
//]
```

### Using assert or check function
If has error assert function will throw an error.
Check function return boolean.

Example 14
```js
const Person = new Type({
  name: string,
});

const me = {
  name: 12,
};

const errors = Person.assert(me);
// -> throw a new Error

const ok = Person.check(me);
// => false
```
