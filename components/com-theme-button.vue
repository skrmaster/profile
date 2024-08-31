<script lang="ts" setup>
import type { StorageSuger as StorageSugerType } from '#imports';

enum Theme {
  'light' = 0,
  'dark' = 1
}

type Size = 'normal' | 'small'

type Prop = {
  type?: Size
}

const props = withDefaults(defineProps<Prop>(), {
  type: 'normal'
})

const theme = ref<Theme>(0);
const start = ref(false);
const themeState = useState('theme', () => 'light');
let storage: StorageSugerType;

const sizeMap: Record<Size, object> = {
  'normal': { width: '1em', height: '1em' },
  'small': { width: '0.5em', height: '0.5em' }
}

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

onMounted(() => {
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
    :size-type="type"
  >
    <div class="theme__content flex__center"
      :class="{
        'transition': start
      }"
    >
      <com-icon v-show="theme === 0" v-bind="{ ...sizeMap[type] }" icon="profile-sun"></com-icon>
      <com-icon v-show="theme === 1" v-bind="{ ...sizeMap[type] }" icon="profile-moon"></com-icon>
    </div>
  </button>
</template>
<style scoped>
.theme__btn[size-type="normal"] {
  height: 28px;
  width: 50px;
  border: 1px solid var(--primary-border-color);
  border-radius: 28px;
  background: var(--nav-theme-btn-bg);
}

.theme__btn[size-type="small"] {
  height: 14px;
  width: 25px;
  border: 1px solid var(--primary-border-color);
  border-radius: 14px;
  background: var(--nav-theme-btn-bg);
}

.theme__btn[size-type="normal"] .theme__content {
  margin-left: 2px;
  width: 22px;
  height: 22px;
  background: var(--white-color);
  border-radius: 50%;
  transition: all .2s;
}

.theme__btn[size-type="small"] .theme__content {
  margin-left: 2px;
  width: 10px;
  height: 10px;
  background: var(--white-color);
  border-radius: 50%;
  transition: all .2s;
}

.transition[size-type="normal"] {
  transform: translateX(calc(50px - 28px));
}

.transition[size-type="small"] {
  transform: translateX(calc(25px - 14px));
}
</style>