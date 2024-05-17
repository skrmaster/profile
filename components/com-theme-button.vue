<script lang="ts" setup>

enum Theme {
  'light' = 0,
  'dark' = 1
}

const theme = ref<Theme>(0);
const start = ref(false);

function handleStart() {
  start.value = !start.value;
  theme.value === 0
  ? theme.value = 1
  : theme.value = 0;
}
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