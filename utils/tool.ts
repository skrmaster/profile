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

export class CanvasUtils implements CanvasUtil {
  w: number
  h: number
  constructor(w: number, h: number) {
    this.w = w
    this.h = h
  }
  getCanvasCenterPointPosition() {
    const x = Math.ceil(this.w / 2)
    const y = Math.ceil(this.h / 2)
    return { x, y }
  }
}
