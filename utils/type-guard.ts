export function isFile(variable: any): variable is File {
  return variable instanceof File;
}
