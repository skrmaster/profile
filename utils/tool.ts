export function debounce(func: (arg: unknown) => unknown, time = 1000) {
  let id: null | ReturnType<typeof setTimeout> = null
  
  return function(...args: unknown[]) {
    if (id) {
      clearTimeout(id)
    }
    
    id = setTimeout(() => {
      func(args)
    }, time)
  }
}

export function throttle() {

}

export function resize(el: Element, cb: (arg: ResizeType) => unknown): ResizeObserver {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const obj: ResizeType = {
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
