//生命周期使用，若应用程序使用见plugins/uniqueId.ts

import { ref } from 'vue';

function useUniqueId() {
  const id = ref(Date.now().toString(36) + Math.random().toString(36).substring(2, 5));
  return { id };
}

export default useUniqueId;
