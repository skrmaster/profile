//避免全局污染
export {};

declare module '#app' {
  interface NuxtApp {
    $message: MessageManager;
    $confirm: MessageConfirm;
    $sanitize: DOMPurify.DOMPurifyI.sanitize;
  }
}
declare module '@wangeditor/editor-for-vue' {
  const content: any;
  export default content;
}
