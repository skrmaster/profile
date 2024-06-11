export function isFile(variable: any): variable is File {
  return variable instanceof File;
}

export function isNull(variable: any): variable is null {
  return variable === null;
}

export function isUndefined(variable: any): variable is undefined {
  return variable === undefined;
}

export function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
  return (event as MouseEvent).pageX !== undefined;
}

export function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return (event as TouchEvent).touches !== undefined;
}
