type Resize = {
  w: number;
  h: number;
}

type StorageFrom = 'localStorage' | 'sessionStorage';

function resize(el: Element, cb: (arg: Resize) => unknown): ResizeObserver;
function debounce(func: (arg: unknown) => unknown, time = 1000): (...args: unknown[]) => void;