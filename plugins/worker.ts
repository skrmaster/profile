export default defineNuxtPlugin(() => {
  const url = new URL("~/utils/home-worker.js", import.meta.url);
  const createWorker = () => new Worker(url);

  return {
    provide: {
      worker: createWorker,
    },
  };
});
