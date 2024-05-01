declare interface CanvasUtil {
  getCanvasCenterPointPosition(): { x: number; y: number }
}

declare module 'uuid';

declare type StackItem = {
  name: string;
  icon?: string;
  officalUrl?: string;
  isChoose: boolean;
}
