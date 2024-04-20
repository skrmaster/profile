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
