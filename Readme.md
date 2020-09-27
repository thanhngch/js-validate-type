## Run
`node index.js`
node version >= 10

## How to test

- `number` : value is number
- `number | string | array`: number or string or array
- `string | optional`: is optional string
- `[string]` : Array of string
- `[[1,2,3]]` : Value is 1, 2 or 3
- `[[max, 10]]`: Value max is 10
- `[[max, 10], [min, 1]]`: Value max is 10 and min 1
- `[[isString], [length, [10, 15]]` is String and length is between 10 and 15
- `[[isArray], [length, [2]]` is Array and length is great than 2
