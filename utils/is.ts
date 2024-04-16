/**
 * @description 判断是否为对象
 */
export function isObject(value: unknown): boolean {
  return !!value && typeof value === 'object' && value.constructor === Object;
}

/**
 * @description 判断一个对象是否是另一个对象的子集
 */
export function isSubSet<T>(subObj: T, superObj: T): boolean {
  for (const prop in subObj) {
    if (Object.prototype.hasOwnProperty.call(superObj, prop)) {
      if (isObject(subObj[prop])) {
        if (!isSubSet(subObj[prop], superObj[prop])) {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  return true;
}

/**
 * @description 判断字符串是否是正则表达式
 */
export function isRegExp(str: string | RegExp): boolean {
  try {
    new RegExp(str);
    return Boolean(str) && true;
  } catch (e) {
    return false;
  }
}

