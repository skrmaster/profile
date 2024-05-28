import { useDayjs } from '#dayjs';

export function debounce(func: (arg: unknown) => unknown, time = 1000): (...arg: unknown[]) => void {
  let id: null | ReturnType<typeof setTimeout> = null;

  return function(...args: unknown[]) {
    if (id) {
      clearTimeout(id);
    }
    
    id = setTimeout(() => {
      func(args);
    }, time);
  }
}

export function throttle() {

}

export function resize(el: HTMLElement, cb: (arg: Resize) => unknown): ResizeObserver {
  let isFirstCall = true;
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const obj: Resize = {
        w: entry.borderBoxSize[0].inlineSize,
        h: entry.borderBoxSize[0].blockSize
      }
      if (isFirstCall) {
        isFirstCall = false;
      } else {
        cb(obj);
      }
    }
  });
  if (el) {
    resizeObserver.observe(el);
  }

  return resizeObserver;
}

export function timeNullFormat(time?: string): string {
  const dayjs = useDayjs();
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '暂无';
}

export function isFile(variable: any): variable is File {
  return variable instanceof File;
}
