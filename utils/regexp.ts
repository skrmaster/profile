const config: Record<string, RegExp> = {
  'email': /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
  'phone': /^1[34578]\d{9}$/g,
}

export function vaildTest(val: string, rule: string | RegExp | undefined): boolean {
  let result = false
  for (const key in config) {
    if (rule === key) {
      result = config[key].test(val);
    } else {
      result = (rule as RegExp).test(val);
    }
  }
  return result
}