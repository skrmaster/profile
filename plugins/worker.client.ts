export default defineNuxtPlugin(() => {
  const url = new URL('~/utils/worker.ts', import.meta.url);
  const createWorker = () => new Worker(url);

  return {
    provide: {
      worker: createWorker,
    },
  };
});