import { useDayjs } from '#dayjs';

const imagePrefix = import.meta.env.VITE_PROJECT_IMAGE_PREFIX;

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
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const obj: Resize = {
        w: entry.borderBoxSize[0].inlineSize,
        h: entry.borderBoxSize[0].blockSize
      }
      cb(obj);
    }
  });
  if (el) {
    resizeObserver.observe(el);
  }

  return resizeObserver;
}

export function timeNullFormat(time?: string, formatString = 'YYYY-MM-DD HH:mm:ss'): string {
  const dayjs = useDayjs();
  return time ? dayjs(time).format(formatString) : '暂无';
}

export function splicingImageUrl(raw: string): string | undefined {
  if (!raw) {
    return;
  }
  const url = new URL(raw, imagePrefix);
  return url.toString();
}

export function getAvatar(item: Upload.FileInfo): string | undefined {
  if (!item) {
    return;
  }

  return splicingImageUrl(item.fullPath);
}

export function getScrollBarWidth(): number {
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollbarWidth;
}
