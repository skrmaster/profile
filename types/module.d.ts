import { SlateDescendant, SlateElement, SlateText } from '@wangeditor/editor';
//避免全局污染
export {}

declare module 'vue' {
  interface HTMLElement {
    _loadingStartTime?: number;
    _loadingDisplayStartTime?: number;
    _loadingTimerMounted?: ReturnType<typeof setTimeout>;
    _loadingTimerUpdate?: ReturnType<typeof setTimeout>;
  }
}

declare module '#app' {
  interface NuxtApp {
    $message: MessageManager;
    $confirm: MessageConfirm;
    $sanitize: DOMPurify.DOMPurifyI.sanitize;
  }
}

declare module '@wangeditor/editor' {
  // 扩展 Text
  interface SlateText {
    text: string;
  }

  // 扩展 Element
  interface SlateElement {
    type: string;
    children: SlateDescendant[];
  }
}
