import { createVNode, render } from 'vue';
import Message from '~/components/com-confirm.client.vue';

interface Option {
  message: string;
  buttonConfirmText?: string;
  buttonCannelText?: string;
  title?: string;
}

const defaultOption = {
  title: '注意!',
  buttonConfirmText: '确认',
  buttonCannelText: '取消'
}

class MessageManager {
  static confirm(options: Option) {
    const mergeOption = { ...defaultOption, ...options };
    const element = createVNode(Message, mergeOption);
    render(element, document.body);

    return new Promise((resolve, reject) => {
      
    })
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('comfirm', MessageManager);
});
