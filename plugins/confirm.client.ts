import { createVNode, render } from 'vue';
import MessageConfirm from '~/components/com-confirm.client.vue';
import { getZIndex } from './zIndex';
import EventBus from '~/utils/eventBus';

export const bus = new EventBus();
let id = 1;

function getId(): string {
  return `message-confirm-${id++}`;
}

const defaultOption: Omit<Option, 'message'> = {
  title: '注意!',
  buttonConfirmText: '确认',
  buttonCannelText: '取消',
  id: '',
  zIndex: '',
  onlyShowConfirm: false
}

export class MessageConfirmManager {
  static show(options: Option) {
    defaultOption.id = getId();
    defaultOption.zIndex = getZIndex().toString();
    defaultOption.onlyShowConfirm = true;
    const mergeOption = { ...defaultOption, ...options };
    const vnode = createVNode(MessageConfirm, mergeOption);
    vnode.key = mergeOption.id as string;
    render(vnode, document.body);

    return new Promise<void>((resolve) => {
      bus.on('confirm', () => {
        resolve();
      });
    });
  }
  static confirm(options: Option) {
    defaultOption.id = getId();
    defaultOption.zIndex = getZIndex().toString();    
    const mergeOption = { ...defaultOption, ...options };
    const vnode = createVNode(MessageConfirm, mergeOption);
    vnode.key = mergeOption.id as string;
    render(vnode, document.body);
    return new Promise<void>((resolve, reject) => {
      bus.on('confirm', () => {
        resolve();
      });
      bus.on('cannel', () => {
        reject();
      });
    });
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('confirm', MessageConfirmManager);
});
