<script lang="ts" setup>
import PersonalNavigation from './personal-navigation.vue';
import PersonalNavigationSmall from './personal-navigation-small.vue';

useHead({
  title: "个人中心"
});
</script>
<template>
  <div class="background flex__column">
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <personal-navigation-small class="display-5-none display-4-none display-3-none"></personal-navigation-small>
    <section class="flex__column flex1">
      <div class="container flex__column flex1">
        <div class="flex flex1 flex-nowrap gap__clear transition">
          <personal-navigation class="display-2-none display-1-none display-0-none"></personal-navigation>
          <main class="flex__column">
            <slot></slot>
          </main>
        </div>
      </div>
    </section>
    <com-footer></com-footer>
  </div>
</template>
<style scoped>
.background {
  background-image: radial-gradient(#ffffff 0, var(--background-color) 100%);
  background-blend-mode: screen;
  max-width: 100vw;
  width: 100%;
  min-height: 100vh;
}

.gap__clear {
  margin: 0 0 0 -1rem;
}

section {
  padding: 10px 0;
}

main {
  flex: 1;
  overflow: hidden;
}
</style>