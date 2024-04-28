import { stringRegexp } from '@/utils/regexp';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('drag', {
    mounted(el: HTMLElement) {
      el.draggable = false;
      let start = false;
      let mouseX: number;
      let mouseY: number;
      let originTranslate;
      let translateX: number, translateY: number;
      const originDuration = el.style.transitionDuration;

      function dragMouseDown(e: MouseEvent) {
        start = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        el.style.transitionDuration = '0s';
        originTranslate = stringRegexp(el.style.translate, 'number');
        translateX = originTranslate && originTranslate[0] 
          ? parseInt(originTranslate[0]) 
          : 0;
        translateY = originTranslate && originTranslate[1] 
          ? parseInt(originTranslate[1]) 
          : 0;
      }

      el.addEventListener('mousedown', dragMouseDown);

      document.addEventListener('mousemove', function(e: MouseEvent) {
        if (!start) {
          return
        }
        const x = e.clientX;
        const y = e.clientY;
        const dx = x - mouseX;
        const dy = y - mouseY;
        el.style.translate = `${translateX + dx}px ${translateY + dy}px`;
      });

      document.addEventListener('mouseup', function(e: MouseEvent) {
        start = false;
        mouseX = e.clientX;
        mouseY = e.clientY;
        el.style.transitionDuration = originDuration;
        document.removeEventListener('mousedown', dragMouseDown);
      });
    }
  });
});