import {
  isObject,
  isArray,
  isBoolean,
  isNumber,
  isString,
  isFunction,
  isPromise,
  isNull,
  isUndefined,
  isInteger,
} from './util';

export * from './util';

const MAX_TYPE = 2048;
const ALL_TYPE = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

export const Self = -1;
export const optional = 1;
export const boolean = 2;
export const number = 4;
export const string = 8;
export const integer = 16;
export const Null = 32;
export const Undefined = 64;
export const array = 128;
export const object = 256;
export const func = 512;
export const promise = 1024;

export const max = (value, a) => a >= value;
export const min = (value, a) => a <= value;
export const regex = (value, regexExpress) => regexExpress.test(value);

export const length = (
  arrOrString,
  [a, b = Number.POSITIVE_INFINITY],
) => arrOrString.length >= a && arrOrString.length <= b;

export const isOptional = () => true;
export const isArrayElement = () => true;

const validateObj = {
  [optional]: () => true,
  [boolean]: isBoolean,
  [number]: isNumber,
  [string]: isString,
  [integer]: isInteger,
  [Null]: isNull,
  [Undefined]: isUndefined,
  [array]: isArray,
  [object]: isObject,
  [func]: isFunction,
  [promise]: isPromise,
};

export const composeTypeToArray = (_composeNumber) => {
  const arrayType = [];
  let composeNumber = _composeNumber;
  for (let i = 0; composeNumber > 0; i += 1) {
    const remander = composeNumber % 2;
    if (remander === 1) {
      arrayType.push(ALL_TYPE[i]);
    }
    composeNumber = Number.parseInt(composeNumber / 2, 10);
  }
  return arrayType;
};

export class Type {
  constructor(_schema) {
    this.schema = _schema;
    this.listError = [];
  }

  /**
   * Validate function 'valueParam' is has type 'typeParam'
   * @param {array|object|string|number|...} valueParam value to check
   * @param {number} typeParam type is string, number, string | number,...
   * @param {string} key this is key path like profile.name
   * @param {object} wrapperObject object wrap valueParam
   */
  validateRecusive(valueParam, typeParam, keyParam, wrapperObject) {
    let key = keyParam;
    if (wrapperObject === undefined && !isObject(valueParam)) {
      // key is value if valueParam is not object
      key = valueParam;
    }
    let type = typeParam;
    if (typeParam instanceof Type) {
      type = type.schema;
    }
    let value = valueParam;
    if (isObject(valueParam)) {
      // create clone object
      value = {
        ...valueParam,
      };
    } else if (isArray(valueParam)) {
      value = [...valueParam];
    }
    if (type === optional) {
      return;
    }
    if (!value && type === Self) {
      return;
    }
    if (isFunction(type)) {
      if (!(value instanceof type)) {
        this.listError.push({
          key,
          message: `'${value} is not instance of class ${type.name}'`,
        });
      }
      return;
    }
    if (isArray(type) && isArray(type[0])) {
      // function test eg: max, min, length, isString, isOptional, ...
      if (isFunction(type[0][0])) {
        let i = 0;
        let isArrayCheck = false;
        if (type[0][0] === isOptional) {
          const keyOfObject = key && isString(key) ? key.split('.').pop() : undefined;
          const keyDesc = Object.getOwnPropertyDescriptor(wrapperObject || {}, keyOfObject);
          if (value === undefined && keyDesc === undefined) {
            // don't run for loop below
            i = Number.POSITIVE_INFINITY;
          }
        }
        type.forEach((_type) => {
          // check function is [[isArray]]
          if (_type[0] === isArrayElement) {
            isArrayCheck = true;
          }
        });
        for (; i < type.length; i += 1) {
          // functionCheck is min, max, isString,...
          const functionCheck = type[i][0];
          let values = [value];
          if (isArrayCheck) {
            values = value;
          }
          if (!isArray(values)) {
            this.listError.push({
              key,
              message: `'${key}' is not array in compare function`,
            });
            break;
          }
          if (functionCheck.length === 3) {
            if (!functionCheck(null, null, values)) {
              this.listError.push({
                key,
                message: `${functionCheck.name}() return false in array check`,
              });
              break;
            }
          }
          for (let j = 0; j < values.length; j += 1) {
            const valueOfValues = values[j];
            if (!functionCheck(valueOfValues, type[i][1], values)) {
              this.listError.push({
                key: isArray(key) ? valueOfValues : key,
                message: `'${valueOfValues}' is not valid in compare function`,
              });
            }
          }
        }
      } else if (type[0].indexOf(value) === -1) {
        // in array test
        this.listError.push({
          key,
          message: `'${key}' is not valid of ${type[0]}`,
        });
      }
    } else if (isArray(type)) {
      // check array of type, eg: [string] is value of string
      if (type.length !== 1) {
        this.listError.push({
          key,
          message: 'array type not support',
        });
      }
      if (!isArray(value)) {
        if (type && type[0] !== Self) {
          this.listError.push({
            key,
            message: `value of '${key}' is not array`,
          });
        }
      } else {
        value.forEach((v) => {
          this.validateRecusive(v, type[0], key, valueParam);
        });
      }
    } else if (isObject(value)) {
      if (!isObject(type)) {
        if (type === Self) {
          this.validateRecusive(value, this.schema, keyParam, valueParam);
        } else {
          this.listError.push({
            key,
            message: `type not found on ${key}`,
          });
        }
      } else {
        // set value key same key in type
        Object.keys(type).forEach((keyOfKey) => {
          if (value[keyOfKey] === undefined) {
            value[keyOfKey] = undefined;
          }
        });
        // validate object
        Object.keys(value).forEach((keyOfValue) => {
          const path = key ? `${key}.${keyOfValue}` : keyOfValue;
          this.validateRecusive(value[keyOfValue], type[keyOfValue], path, valueParam);
        });
      }
    } else if (isNumber(type) && type < MAX_TYPE * 2) {
      // validate compose type, eg: string | number
      const arrayType = composeTypeToArray(type);
      let validateResult = false;
      arrayType.forEach((aType) => {
        if (validateObj[aType](value)) {
          validateResult = true;
        }
      });
      if (validateResult === false) {
        this.listError.push({
          key,
          message: `'${key}' is not valid type`,
        });
      }
    } else {
      this.listError.push({
        key,
        message: `type of '${key}' not found`,
      });
    }
  }

  validate(value) {
    this.listError = [];
    this.validateRecusive(value, this.schema);
    return this.listError;
  }

  assert(value) {
    this.listError = [];
    this.validateRecusive(value, this.schema);
    if (this.listError.length !== 0) {
      const message = this.listError.map((e) => e.message).join('\n');
      throw new Error(message);
    }
  }
}

export default Type;
