import { defineNuxtPlugin } from '#app'
import type { HTMLElement as HL } from 'nuxt/dist/app/compat/capi';

type ElementType = HL & HTMLElement;
const loadingCircleClass = 'loading-spinner';
const loadingMaskClass = 'loading-mask';
const minElapsed = 200;
const minDisplayTime = 50;

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
        el._loadingTimerMounted = setTimeout(() => {
          createLoading(el);
          el._loadingDisplayStartTime = Date.now();
        }, minElapsed); 
      }
    },
    updated(el: ElementType, binding) {
      const now = Date.now();
      if (binding.value) {
        if (!el.querySelector(`.${loadingCircleClass}`)) {
          el._loadingStartTime = now;
          el._loadingTimerUpdate = setTimeout(() => {
            createLoading(el);
            el._loadingDisplayStartTime = Date.now();
          }, minElapsed); 
        }
      } else {
        const elapsedTime = now - (el._loadingStartTime || 0);
        const remainTime = minElapsed - elapsedTime;
        const displayTime = now - (el._loadingDisplayStartTime || 0);
        
        if (remainTime > 0) {
          clearTimeout(el._loadingTimerMounted);
          clearTimeout(el._loadingTimerUpdate);
        }

        if (displayTime < minDisplayTime) {
          setTimeout(() => {
            removeLoading(el);
          }, minDisplayTime - displayTime);
        } else {
          removeLoading(el);
        }
      }
    },
    unmounted(el) {
      clearTimeout(el._loadingTimerMounted);
      clearTimeout(el._loadingTimerUpdate);
    }
  });
});
