<script lang="ts" setup>
type Prop = {
  toBody?: boolean;
  modelValue: boolean;
  showCloseIcon?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  toBody: false,
  modelValue: false,
  showCloseIcon: false,
});
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
}>();

const { $zIndex } = useNuxtApp();
const zIndex: number = $zIndex();
const visible = computed(() => {
  return props.modelValue;
});

watch(visible, (newVal: boolean) => {
  if (newVal) {    
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = 'auto';
  }
});

function escapeKeyUp(e: KeyboardEvent) {
  if (e.code === 'Escape') {
    emit('update:modelValue', false);
    document.documentElement.style.overflow = 'auto';
  }
}

function closeModel() {
  emit('update:modelValue', false);
}

onMounted(() => {
  document.addEventListener('keyup', escapeKeyUp);
});

onBeforeUnmount(() => {
  document.removeEventListener('keyup', escapeKeyUp);
});

</script>
<template>
  <Teleport to="body" :disabled="!props.toBody">
    <div 
      v-show="visible"
      class="model" 
      :style="{
        zIndex: zIndex
      }"
    >
      <div class="wh100">
        <div v-if="showCloseIcon" 
          class="close flex__center" 
          title="关闭" 
          @click.stop="closeModel"
        >
          <div class="flex1 flex__center close__tip">
            <com-icon 
              width="15px" 
              height="15px" 
              color="var(--white-color)" 
              class="close__icon" 
              icon="profileclose"
            ></com-icon>
          </div>
        </div>
        <div v-bind="$attrs">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
.model {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--model-bg-color);
}

.close {
  cursor: pointer;
  position: absolute;
  right: 10%;
  top: 10%;
  transform: translateY(-50%);
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--model-control-bg-color);
  user-select: none;
}


.close__tip {
  position: relative;
}

.close__tip::after {
  content: "ESC";
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--white-color);
}
</style>