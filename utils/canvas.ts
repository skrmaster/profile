interface CanvasType {
  
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
