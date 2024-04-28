const dictionary: Record<string, RegExp> = {
  'email': /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
  'phone': /^1[34578]\d{9}$/g,
  'password': /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/g,
  'numberCode': /^\d{6}$/g,
  'number': /(-|\+)?\d+(\.\d+)?/g
}

export function vaildTest(val: string, rule: string | RegExp | undefined): [boolean, number] {
  let result: boolean = false
  if (rule) {
    if (Object.hasOwn(dictionary, rule as string)) {
      result = new RegExp(dictionary[rule as string]).test(val);
    } else {
      if (!isRegExp(rule)) {
        result = new RegExp(rule).test(val); 
      }
    }
  } else {
    result = Boolean(val);
  }
  
  if (!val) {
    return [result, 0];
  } else {
    return [result, 1];
  }
}

export function stringRegexp(str: string, type: keyof typeof dictionary) {
  const result = str.match(dictionary[type]);
  return result;
}
