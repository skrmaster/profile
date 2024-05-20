import { createVNode, render } from 'vue';
import MessageConfirm from '~/components/com-confirm.client.vue';
import { getZIndex } from './zIndex';

interface Option {
  message: string;
  buttonConfirmText?: string;
  buttonCannelText?: string;
  title?: string;
  zIndex: string;
  id: string;
}

let id = 1;

function getId(): string {
  return `message-confirm-${id++}`;
}

const defaultOption: Omit<Option, 'message'> = {
  title: '注意!',
  buttonConfirmText: '确认',
  buttonCannelText: '取消',
  id: '',
  zIndex: ''
}

class MessageConfirmManager {
  static show(options: Option) {
    defaultOption.id = getId();
    defaultOption.zIndex = getZIndex().toString();    
    const mergeOption = { ...defaultOption, ...options };
    const vnode = createVNode(MessageConfirm, mergeOption);
    vnode.key = mergeOption.id;
    render(vnode, document.body);
  }
  static confirm(options: Option) {
    const mergeOption = { ...defaultOption, ...options };
    const vnode = createVNode(MessageConfirm, mergeOption);
    render(vnode, document.body);
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('confirm', MessageConfirmManager);
});
