let modelZIndex = 999;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      zIndex: () => modelZIndex++
    }
  }
});
