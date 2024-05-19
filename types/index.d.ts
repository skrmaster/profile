interface CanvasUtil {
  getCanvasCenterPointPosition(): { x: number; y: number }
}

type StackItem = {
  name: string;
  icon?: string;
  officalUrl?: string;
  isChoose: boolean;
}

type LabelValue = {
  value: string;
  label: string;
}
