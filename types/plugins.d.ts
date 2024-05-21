export {}

declare module '#app' {
  interface NuxtApp {
    $message: MessageManager;
    $confirm: MessageConfirm;
  }
}
