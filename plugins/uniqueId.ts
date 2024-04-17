let currentId = 0;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      uniqueId: () => 'id-' + currentId++
    }
  }
});
