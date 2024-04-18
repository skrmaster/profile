let currentZIndex = 999;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      zIndex: () => currentZIndex++
    }
  }
});
