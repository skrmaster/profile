<script setup lang="ts">
const showCookie = ref(false);
const smallCookie = ref(false);
const cookieRef = ref();
let timer: ReturnType<typeof setTimeout>;
let elementResize: ResizeObserver | null = null;
const debounceFunction = debounce(handleLayout, 10);

watch(cookieRef, (val) => {
  if (val) {
    elementResize = resize(cookieRef.value, (wh) => {
      debounceFunction();
    });
  }
});

function handleLayout() {
  if (window.innerWidth <= 992) {
    smallCookie.value = true;
  } else {
    smallCookie.value = false;
  }
}

onNuxtReady(() => {
  const auth = useCookie("s-auth-cookie");
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
  <div v-if="false" ref="cookieRef">
    <Transition name="bottom2top">
      <com-cookie
        v-if="showCookie && !smallCookie"
        @close="showCookie = false"
      ></com-cookie>
      <com-cookie-small
        v-else-if="showCookie && smallCookie"
        @close="showCookie = false"
      ></com-cookie-small>
    </Transition>
  </div>
</template>

<style scoped></style>
