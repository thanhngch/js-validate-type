export function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isBoolean(value) {
  return value === true || value === false;
}

export function isString(value) {
  return typeof value === 'string';
}

// check is function or class
export function isFunction(value) {
  return typeof value === 'function';
}

export function isSymbol(value) {
  return typeof value === 'symbol';
}

// check is normal object not array, date,...
export function isObject(value) {
  return value && typeof value === 'object'
    && value.constructor === Object;
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isNaN(value) {
  return typeof value === 'number' && Number.isNaN(value);
}

export const isNull = (value) => value === null;

export const isUndefined = (value) => value === undefined;

export const { isInteger } = Number;

export function isEmptyObject(value) {
  return isObject(value) && Object.keys(value).length === 0;
}

export function isEmptyArray(value) {
  return isArray(value) && value.length === 0;
}

export function isPromise(value) {
  return value && `${value}` === '[object Promise]';
}

export function isRegex(value) {
  return value.constructor === RegExp;
}

export function isBigInt(value) {
  return typeof value === 'bigint';
}
