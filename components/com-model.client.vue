<script lang="ts" setup>
type Prop = {
  toBody?: boolean;
  modelValue: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  toBody: false,
  modelValue: false,
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
    document.documentElement.style.overflow = 'scroll';
  }
});

function escapeKeyUp(e: KeyboardEvent) {
  if (e.code === 'Escape') {
    emit('update:modelValue', false);
    document.documentElement.style.overflow = 'scroll';
  }
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
</style>