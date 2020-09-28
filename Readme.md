## How to using

```js
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

## List type

- `number` : value is number
- `number | string | array`: number or string or array
- `string | optional`: is optional string
- `[string]` : array of string
- `[[1,2,3]]` : value is 1, 2 or 3
- `[[max, 10]]`: value max is 10
- `[[max, 10], [min, 1]]`: value max is 10 and min 1
- `[[isString], [length, [10, 15]]` is string and length is between 10 and 15
- `[[isArray], [length, [2]]` is array and length is great than 2
- `{name: string}`: object has name is string
