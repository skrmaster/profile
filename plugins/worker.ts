export default defineNuxtPlugin(() => {
  const url = new URL('~/utils/worker.js', import.meta.url);
  const createWorker = () => new Worker(url);

  return {
    provide: {
      worker: createWorker,
    },
  };
});