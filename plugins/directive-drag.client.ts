export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('drag', {
    mounted(el: HTMLElement, binding) {
      if (!binding.value) {
        return;
      }
      
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const parent = el.parentElement;
      let div: HTMLElement;
      let start = false;
      nextTick(() => {
        console.log(el, w, h);
      });

      el.addEventListener('mousedown', function(e: MouseEvent) {
        console.log(e);
        start = true;
        div = document.createElement('div');
        div.style.width = `${w}px`;
        div.style.height = `${h}px`;
        div.style.visibility = 'hidden';
        parent?.appendChild(div);

        el.style.position = 'absolute';
        // el.style.left = `${e.clientX - w / 2}px`
        // el.style.top = `${e.clientY - h / 2}px`

      });

      el.addEventListener('mousedown', function(e: MouseEvent) {
        console.log(e);
        
      });

      el.addEventListener('mouseup', function(e: MouseEvent) {
        console.log(e);
        start = false;
        
      });
    }
  });
});