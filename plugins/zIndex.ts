export let modelZIndex = 999;

export function getZIndex() {
  return modelZIndex++;
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      zIndex: () => modelZIndex++
    }
  }
});
