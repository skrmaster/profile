<script setup lang="ts">

const showCookie = ref(false);
let timer: ReturnType<typeof setTimeout>;

onNuxtReady(() => {
  const auth = useCookie('s-auth-cookie');
  const userAuth = auth.value ? JSON.parse(auth.value) : false;  

  if (!userAuth) {
    timer = setTimeout(() => {
      showCookie.value = true;
    }, 0);
  }
});

onUnmounted(() => {
  clearTimeout(timer);
});

</script>
<template>
  <slot></slot>
  <Transition name="bottom2top">
    <com-cookie v-if="showCookie"  @close="showCookie = false"></com-cookie>
  </Transition>
</template>

<style scoped>

</style>