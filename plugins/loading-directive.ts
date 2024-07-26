import { defineNuxtPlugin } from '#app';
interface VueExtends {
  _loadingStartTime?: number;
  _loadingDisplayStartTime?: number;
  _loadingTimerMounted?: ReturnType<typeof setTimeout>;
  _loadingTimerUpdate?: ReturnType<typeof setTimeout>;
}

type ElementType = HTMLElement & VueExtends;
const loadingCircleClass = 'loading-spinner';
const loadingMaskClass = 'loading-mask';
const minElapsed = 200;
const minDisplayTime = 150;

function createLoading(el: HTMLElement) {
  if (!el.querySelector(`.${loadingCircleClass}`)) {
    const spinner = document.createElement('div');
    spinner.className = loadingCircleClass;
    el.appendChild(spinner);
  }
  if (!el.querySelector(`.${loadingMaskClass}`)) {
    const mask = document.createElement('div');
    mask.className = loadingMaskClass;
    el.appendChild(mask);
  }
  el.style.position = 'relative';
}

function removeLoading(el: HTMLElement) {
  let spinner: HTMLElement | null = null;
  let mask: HTMLElement | null = null;

  for (const item of el.children) {
    if (item.className.includes(loadingCircleClass)) {
      spinner = item as HTMLElement;
    }

    if (item.className.includes(loadingMaskClass)) {
      mask = item  as HTMLElement;
    }
  }
  
  spinner?.remove();
  mask?.remove();
  el.style.position = '';
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('loading', {
    mounted(el: ElementType, binding) {
      if (binding.value) {
        el._loadingStartTime = Date.now();
        
        clearTimeout(el._loadingTimerMounted);
        el._loadingTimerMounted = setTimeout(() => {
          el._loadingDisplayStartTime = Date.now();
          createLoading(el);
        }, minElapsed); 
      }
    },
    updated(el: ElementType, binding) {
      //异步完成时间
      const now = Date.now();
      if (binding.value) {
        if (!el.querySelector(`.${loadingCircleClass}`)) {
          el._loadingStartTime = now;
          clearTimeout(el._loadingTimerUpdate);
          el._loadingTimerUpdate = setTimeout(() => {
            el._loadingDisplayStartTime = Date.now();
            createLoading(el);
          }, minElapsed); 
        }
      } else {
        //异步时间
        const elapsedTime = now - (el._loadingStartTime || 0);

        //最小异步时间 - 异步时间
        const remainTime = minElapsed - elapsedTime;
        if (remainTime > 0) {
          //不用触发loading动画
          clearTimeout(el._loadingTimerMounted);
          clearTimeout(el._loadingTimerUpdate);
          removeLoading(el);
          return;
        }

        //需要触发loading动画
        //异步完成时间 - 最小loading动画时间
        const displayTime = now - (el._loadingDisplayStartTime || 0);
        if (displayTime < minDisplayTime) {
          //展示剩余loading动画时间
          setTimeout(() => {
            removeLoading(el);
          }, minDisplayTime - displayTime);
        } else {
          //直接展示
          removeLoading(el);
        }
      }
    },
    beforeUnmount(el) {
      clearTimeout(el._loadingTimerMounted);
      clearTimeout(el._loadingTimerUpdate);
    }
  });
});
