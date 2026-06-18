export function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function keysToCamel<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamel) as T;
  }

  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        keysToCamel(value),
      ]),
    ) as T;
  }

  return obj;
}
