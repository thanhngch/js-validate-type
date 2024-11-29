export function isNumber(value: any) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isBoolean(value: any) {
  return value === true || value === false;
}

export function isString(value: any) {
  return typeof value === 'string';
}

// check is function or class
export function isFunction(value: any) {
  return typeof value === 'function';
}

export function isSymbol(value: any) {
  return typeof value === 'symbol';
}

// check is normal object not array, date,...
export function isObject(value: any) {
  return value && typeof value === 'object'
    && value.constructor === Object;
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isNaN(value: any) {
  return typeof value === 'number' && Number.isNaN(value);
}

export const isNull = (value: any) => value === null;

export const isUndefined = (value: any) => value === undefined;

export const { isInteger } = Number;

export function isEmptyObject(value: any) {
  return isObject(value) && Object.keys(value).length === 0;
}

export function isEmptyArray(value: any) {
  return isArray(value) && value.length === 0;
}

export function isPromise(value: any) {
  return value && `${value}` === '[object Promise]';
}

export function isRegex(value: any) {
  return value.constructor === RegExp;
}

export function isBigInt(value: any) {
  return typeof value === 'bigint';
}

export const max = (value: number, a: number) => a >= value;
export const min = (value: number, a: number) => a <= value;
export const regex = (value: string, regexExpress: RegExp) => regexExpress.test(value);

export const length = (
  arrOrString: string| Array<any>,
  [a, b = Number.POSITIVE_INFINITY] : [number, number] | [number],
) => arrOrString.length >= a && arrOrString.length <= b;
