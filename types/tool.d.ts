type Resize = {
  w: number;
  h: number;
}

type StorageFrom = 'localStorage' | 'sessionStorage';

function resize(el: Element, cb: (arg: Resize) => unknown): ResizeObserver;
function debounce(func: (arg: any) => unknown, time = 1000): (...args: unknown[]) => void;

type Option = {
  message: string;
  buttonConfirmText?: string;
  buttonCannelText?: string;
  title?: string;
  zIndex?: string;
  id?: string;
  onlyShowConfirm?: boolean;
}

interface MessageConfirm {
  show: (options: Option) => Promise<void>;
  confirm: (options: Option) => Promise<void>;
}

type MessageOptions = {
  message: string;
  type?: 'success' | 'warning' | 'info' | 'error';
  duration?: number;
  id?: string;
  topOffset?: string;
}

interface MessageManager {
  show: (options: MessageOptions) => void
}
