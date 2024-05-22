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
  }
}
