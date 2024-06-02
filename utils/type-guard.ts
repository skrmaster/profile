export function isFile(variable: any): variable is File {
  return variable instanceof File;
}

export function isNull(variable: any): variable is null {
  return variable === null;
}

export function isUndefined(variable: any): variable is undefined {
  return variable === undefined;
}
