const dictionary: Record<string, RegExp> = {
  'email': /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
  'phone': /^1[34578]\d{9}$/g,
  'password': /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/g,
}

export function vaildTest(val: string, rule: string | RegExp | undefined): [boolean, number] {
  let result: boolean = false

  if (rule && Object.hasOwn(dictionary, rule as string)) {
    console.log(isRegExp(rule), "isr");
    
    if (!isRegExp(rule)) {
      result = dictionary[rule as string].test(val);
    } else {
      result = new RegExp(rule).test(val);
    }
  }
  
  if (!val) {
    return [result, 0];
  } else {
    return [result, 1];
  }
}