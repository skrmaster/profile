declare type ResizeType = {
  w: number;
  h: number;
}

declare function resize(el: Element, cb: (arg: ResizeType) => unknown): ResizeObserver;
declare function debounce(func: (arg: unknown) => unknown, time = 1000): (...args: unknown[]) => void;
