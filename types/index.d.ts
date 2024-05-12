declare interface ICanvasUtil {
  getCanvasCenterPointPosition(): { x: number; y: number }
}

declare type StackItem = {
  name: string;
  icon?: string;
  officalUrl?: string;
  isChoose: boolean;
}

declare type LabelValue = {
  value: string;
  label: string;
}
