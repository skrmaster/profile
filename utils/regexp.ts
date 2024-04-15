const config: Record<string, RegExp> = {
  'email': /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
  'phone': /^1[34578]\d{9}$/g,
  'password': /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/g,
}

export function vaildTest(val: string, rule: string | RegExp | undefined): [boolean, number] {
  let result = false
  for (const key in config) {
    if (rule === key) {
      result = config[key].test(val);
    } else {
      if (rule) {
        const regex = new RegExp(rule);
        result = regex.test(val);
      }
    }
  }
  if (!val) {
    return [result, 0];
  } else {
    return [result, 1];
  }
}