import { createVNode, render } from 'vue';
import Message from '~/components/com-message.client.vue';

interface MessageOptions {
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  duration?: number;
}

const defaultOptions = {
  duration: 2000
};

const container = document.createElement('div');
document.body.appendChild(container);

class MessageManager {
  static show(options: MessageOptions) {
    const opts = { ...defaultOptions, ...options };
    const vnode = createVNode(Message, opts);
    render(vnode, container);
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('message', MessageManager);
});
