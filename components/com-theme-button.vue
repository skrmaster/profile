<script lang="ts" setup>
import type { StorageSuger as StorageSugerType } from '#imports';

enum Theme {
  'light' = 0,
  'dark' = 1
}

const theme = ref<Theme>(0);
const start = ref(false);
const themeState = useState('theme', () => 'light');
let storage: StorageSugerType;

function handleStart() {
  start.value = !start.value;
  setCurrentTheme();
}

function setCurrentTheme() {
  if (theme.value === 0) {
    theme.value = 1;
    setTheme('dark');
    storage.setValue('theme', 'dark');
    themeState.value = 'dark';
  } else {
    theme.value = 0;
    setTheme('light');
    storage.setValue('theme', 'light');
    themeState.value = 'light';
  }
}

onNuxtReady(() => {
  storage = new StorageSuger('localStorage');
  const themeString = storage.getValue('theme') as string;
  const currentTheme = themeString ? JSON.parse(themeString) : '';

  if (currentTheme === 'dark') {
    theme.value = 1;
    start.value = true;
    setTheme('dark');
    themeState.value = 'dark';
  } else {
    theme.value = 0;
    setTheme('light');    
    themeState.value = 'light';
  }
});
</script>
<template>
  <button 
    name="button" 
    type="button" 
    class="theme__btn c-p"
    @click="handleStart"
  >
    <div class="theme__content flex__center"
      :class="{
        'transition': start
      }"
    >
      <com-icon v-show="theme === 0" icon="profile-sun"></com-icon>
      <com-icon v-show="theme === 1" icon="profile-moon"></com-icon>
    </div>
  </button>
</template>
<style scoped>
.theme__btn {
  height: 28px;
  width: 50px;
  border: 1px solid var(--primary-border-color);
  border-radius: 28px;
  background: var(--nav-theme-btn-bg);
}

.theme__content {
  margin-left: 2px;
  width: 22px;
  height: 22px;
  background: var(--white-color);
  border-radius: 50%;
  transition: all .2s;
}

.transition {
  transform: translateX(calc(50px - 28px));
}
</style>