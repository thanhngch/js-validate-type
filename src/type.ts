import {
  isArray,
  isBoolean,
  isFunction,
  isInteger,
  isNull,
  isNumber,
  isObject,
  isPromise,
  isString,
  isUndefined,
} from './util';

export * from './util';

const MAX_TYPE = 1024;
type TYPE_T = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024;
const ALL_TYPE : TYPE_T[] = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

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

export const isOptional = () => true;
export const isArrayElement = () => true;

const FixedArrayElement = 'FixedArrayElement';
type FixedArrayElementType = {
  type: string;
  args: Array<any>;
}
export const isFixedArrayElement = (...args: Array<any>) => { 
  return () => {
    return {
      type: FixedArrayElement,
      args
    } as FixedArrayElementType
  }; 
};

type ValidateObjType = {
  [K in TYPE_T]: (value: any) => boolean
}

const validateObj : ValidateObjType = {
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

export const composeTypeToArray = (composeNumber: number): TYPE_T[] => {
  return ALL_TYPE.filter((type) => (composeNumber & type) !== 0);
};

type ListError = {
  key?: string;
  message: string;
}

export class Type {
  schema: any;
  listError: ListError[];

  constructor(_schema: any) {
    this.schema = _schema;
    this.listError = [];
  }

  /**
   * Validate function 'valueParam' is has type 'typeParam'
   * @param {array|object|string|number|...} valueParam value to check
   * @param {any} typeParam type is string, number, string | number,...
   * @param {string} key this is key path like profile.name
   * @param {object} wrapperObject object wrap valueParam
   */
  validateRecusive(valueParam: any, typeParam: any, keyParam?: string, wrapperObject?: any) {
    let key = keyParam;
    if (wrapperObject === undefined && !isObject(valueParam)) {
      // key is value if valueParam is not object
      key = valueParam;
    }

    let type = typeParam;
    if (typeParam instanceof Type) {
      type = typeParam.schema;
    }

    if (type === optional) {
      return;
    }

    if (!valueParam && type === Self) {
      return;
    }

    if (type === Self) {
      this.validateRecusive(valueParam, this.schema, key, wrapperObject);
      return;
    }

    if (isFunction(type)) {
      if (!(valueParam instanceof type)) {
        this.listError.push({
          key,
          message: `'${valueParam} is not instance of class ${type.name}'`,
        });
      }
      return;
    }

    if (isArray(type) && isArray(type[0])) {
      // function test eg: max, min, length, isString, isOptional, ...
      if (isFunction(type[0][0])) {
        let shouldSkip = false;
        if (type[0][0] === isOptional) {
          const keyOfObject = typeof key === 'string' ? key.split('.').pop() : undefined;
          if (
            valueParam === undefined ||
            keyOfObject === undefined ||
            (wrapperObject && Object.getOwnPropertyDescriptor(wrapperObject, keyOfObject) === undefined)
          ) {
            shouldSkip = true;
          }
        }

        if (shouldSkip) {
          return;
        }

        const isArrayCheck = type.some((_type: any) => {
          if (_type[0] === isArrayElement) return true;
          if (isFunction(_type[0]) && _type[0].length === 0) {
            const res = _type[0]();
            return res && res.type === FixedArrayElement;
          }
          return false;
        });

        if (isArrayCheck && !isArray(valueParam)) {
          this.listError.push({
            key,
            message: `'${key}' is not array in compare function`,
          });
          return;
        }

        const values = isArrayCheck ? valueParam : [valueParam];

        for (const [functionCheck, checkArg] of type) {
          if (functionCheck === isOptional || functionCheck === isArrayElement) {
            continue;
          }

          let fixedArrayElementObj: FixedArrayElementType | null = null;
          if (isFunction(functionCheck) && functionCheck.length === 0) {
            const res = functionCheck();
            if (res && res.type === FixedArrayElement) {
              fixedArrayElementObj = res;
            }
          }

          if (fixedArrayElementObj) {
            const args = fixedArrayElementObj.args;
            for (let j = 0; j < values.length; j += 1) {
              const valueOfValues = values[j];
              if (!args || args.length !== values.length) {
                this.listError.push({
                  key: isArray(key) ? valueOfValues : key,
                  message: `'${valueOfValues}' is not valid in check array fixed of length`,
                });
                break;
              } else if (!new Type(args[j]).check(valueOfValues)) {
                this.listError.push({
                  key: isArray(key) ? valueOfValues : key,
                  message: `'${valueOfValues}' is not valid in check array fixed`,
                });
              }
            }
          } else if (isFunction(functionCheck) && functionCheck.length === 3) {
            if (!functionCheck(null, null, values)) {
              this.listError.push({
                key,
                message: `${functionCheck.name}() return false in array check`,
              });
              break;
            }
          } else if (isFunction(functionCheck)) {
            for (let j = 0; j < values.length; j += 1) {
              const valueOfValues = values[j];
              if (!functionCheck(valueOfValues, checkArg)) {
                this.listError.push({
                  key: isArray(key) ? valueOfValues : key,
                  message: `'${valueOfValues}' is not valid in compare function`,
                });
              }
            }
          }
        }
      } else {
        // in array test (enum test)
        if (type[0].indexOf(valueParam) === -1) {
          this.listError.push({
            key,
            message: `'${key}' is not valid of ${type[0]}`,
          });
        }
      }
      return;
    }

    if (isArray(type)) {
      // check array of type, eg: [string] is value of string
      if (type.length !== 1) {
        this.listError.push({
          key,
          message: 'array type not support',
        });
      }
      if (!isArray(valueParam)) {
        if (type && type[0] !== Self) {
          this.listError.push({
            key,
            message: `value of '${key}' is not array`,
          });
        }
      } else {
        valueParam.forEach((v: any) => {
          this.validateRecusive(v, type[0], key, valueParam);
        });
      }
      return;
    }

    if (isObject(type)) {
      if (!isObject(valueParam)) {
        this.listError.push({
          key,
          message: `type of '${key}' not found`,
        });
      } else {
        const allKeys = new Set([...Object.keys(type), ...Object.keys(valueParam)]);
        allKeys.forEach((keyOfValue) => {
          const path = key ? `${key}.${keyOfValue}` : keyOfValue;
          this.validateRecusive(valueParam[keyOfValue], type[keyOfValue], path, valueParam);
        });
      }
      return;
    }

    if (isNumber(type) && type < MAX_TYPE * 2) {
      // validate compose type, eg: string | number
      const arrayType = composeTypeToArray(type);
      const validateResult = arrayType.some((aType) => validateObj[aType](valueParam));
      if (!validateResult) {
        this.listError.push({
          key,
          message: `'${key}' is not valid type`,
        });
      }
      return;
    }

    this.listError.push({
      key,
      message: `type of '${key}' not found`,
    });
  }

  validate(value: any) {
    this.listError = [];
    this.validateRecusive(value, this.schema);
    return this.listError;
  }

  check(value: any) {
    return this.validate(value).length === 0;
  }

  assert(value: any) {
    const errors = this.validate(value);
    if (errors.length !== 0) {
      const message = errors.map((e) => e.message).join('\n');
      throw new Error(message);
    }
  }
}

export default Type;
