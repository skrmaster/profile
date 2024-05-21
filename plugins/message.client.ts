import { createVNode, render } from 'vue';
import Message from '~/components/com-message.client.vue';

let id = 1;
let offset = -3;

function getId(): string {
  return `message-${id++}`;
}

function getOffset(): string {
  offset += 4;
  return `1vh`;
}

class MessageManager {
  static show(options: MessageOptions) {
    const id = getId();
    options.topOffset = getOffset();
    const opts = { ...options, id };
    const vnode = createVNode(Message, opts);
    vnode.key = opts.id;
    render(vnode, document.body);
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('message', MessageManager);
});
