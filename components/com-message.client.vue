<script setup lang="ts">
type MessageOptions = {
  message: string;
  type?: 'success' | 'warning' | 'info' | 'error';
  duration?: number;
  id: string;
  topOffset: string;
}

const props = withDefaults(defineProps<MessageOptions>(), {
  type: 'info',
  duration: 2000,
  topOffset: '1vh'
});

const emit = defineEmits<{
  'update:modelValue': [val: boolean];
}>();

const visible = ref(false);
const id = toRef(() => props.id);

let timer: ReturnType<typeof setTimeout> | null = null;
const typeClass = computed(() => `message-${props.type ? props.type : ''}`);
const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'profile-fill-success';
    case 'warning':
      return 'profile-fill-warning';
    case 'info':
      return 'profile-fill-info';
    case 'error':
      return 'profile-fill-close';
    default:
      return '';
  }
});

function startTimer() {
  if (props.duration > 0) {
    timer = setTimeout(() => {
      removeElement();
    }, props.duration);
  }
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function close() {
  visible.value = false;
  removeElement();
}

function removeElement() {
  visible.value = false;
  setTimeout(() => {
    const element = document.getElementById(id.value);
    element?.remove();
  }, 200)
}

onMounted(() => {
  startTimer();
  nextTick(() => {
    visible.value = true;
  })
});

onBeforeUnmount(() => {
  clearTimer();
  removeElement();
});
</script>
<template>
  <transition name="slide__fade">
    <div
      :style="{
        '--current-top-offset': topOffset
      }"
      v-if="visible"
      :class="['message', typeClass]"
      @mouseenter="clearTimer" 
      @mouseleave="startTimer"
    >
      <com-icon class="prefix__notice" :icon="iconClass"></com-icon>
      <span class="message-content px1">{{ message }}</span>
      <com-icon class="flex__center" width="10px" height="10px" icon="profile-close" @click="close"></com-icon>
    </div>
  </transition>
</template>
<style scoped>
.message {
  position: fixed;
  top: var(--current-top-offset);
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 99999;

  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  margin: 10px;
  font-size: 14px;
  /* border: 1px solid var(--primary-border-color); */
  background-color: var(--white-color);
  box-shadow: var(--box-shadow-small);
  border-style: solid;
  border-color: transparent;
  outline-width: 2px;
  outline-style: solid;
  color: var(--primary-color);
  /* border-width: 2px; */
}

.message-success {
  border-color: var(--message-success-color);
  outline-color: var(--message-success-color);
}

.message-success .prefix__notice :deep(.icon) {
  color: var(--message-success-color)!important;
}

.message-warning {
  border-color: var(--message-warning-color);
  outline-color: var(--message-warning-color);
}

.message-warning .prefix__notice :deep(.icon) {
  color: var(--message-warning-color)!important;
}

.message-info {
  border-color: var(--message-info-color);
  outline-color: var(--message-info-color);
}

.message-info .prefix__notice :deep(.icon) {
  color: var(--message-info-color)!important;
}

.message-error {
  border-color: var(--message-error-color);
  outline-color: var(--message-error-color);
}

.message-error .prefix__notice :deep(.icon) {
  color: var(--message-error-color)!important;
}

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

.slide__fade-enter-active, 
.slide__fade-leave-active {
  transition: all .2s ease .1s;
}

.slide__fade-enter-from {
  transform: translate(-50%, 0) translateY(-100%);
  opacity: 0;
}

.slide__fade-enter-to {
  transform: translate(-50%, 0) translateY(0);
  opacity: 1;
}

.slide__fade-leave-from {
  transform: translate(-50%, 0) translateY(0);
  opacity: 1;
}

.slide__fade-leave-to {
  transform: translate(-50%, 0) translateY(-100%);
  opacity: 0;
}
</style>
