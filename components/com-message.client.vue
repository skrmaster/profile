<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps<{
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  duration: number;
}>();

const visible = ref(true);
let timer: ReturnType<typeof setTimeout> | null = null;

const typeClass = computed(() => `message-${props.type}`);
const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'icon-success';
    case 'warning':
      return 'icon-warning';
    case 'info':
      return 'icon-info';
    case 'error':
      return 'icon-error';
    default:
      return '';
  }
});

const startTimer = () => {
  if (props.duration > 0) {
    timer = setTimeout(() => {
      visible.value = false;
    }, props.duration);
  }
};

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

function close() {
  visible.value = false;
}

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  clearTimer();
});
</script>
<template>
  <transition name="el-fade-in-linear">
    <div v-if="visible" :class="['message', typeClass]" @mouseenter="clearTimer" @mouseleave="startTimer">
      <com-icon :icon="iconClass"></com-icon>
      <span class="message-content px1">{{ message }}</span>
      <com-icon class="flex__center" width="10px" height="10px" icon="profile-close" @click="close"></com-icon>
    </div>
  </transition>
</template>
<style scoped>
.message {
  position: fixed;
  top: 1vh;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 9999999;

  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  margin: 10px;
  font-size: 14px;
  /* border: 1px solid var(--primary-border-color); */
  background-color: var(--white-color);
  box-shadow: var(--box-shadow-small);
}

.message-success {}

.message-warning {}

.message-info {}

.message-error {}

.icon-success,
.icon-warning,
.icon-info,
.icon-error {
  margin-right: 10px;
}

.close-btn {
  margin-left: auto;
  cursor: pointer;
}

.el-fade-in-linear-enter-active,
.el-fade-in-linear-leave-active {
  transition: opacity 0.3s;
}

.el-fade-in-linear-enter-from,
.el-fade-in-linear-leave-to {
  opacity: 0;
}
</style>
