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
const setVisiable = toRef(props.modelValue);
const propModelValue = computed(() => {
  return props.modelValue;
});

watch(propModelValue, (newVal: boolean) => {
  setVisiable.value = newVal;
})

watch(setVisiable, (newVal: boolean) => {
  if (newVal) {    
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = 'scroll';
  }
  emit('update:modelValue', newVal);
})

function escapeKeyUp(e: KeyboardEvent) {
  if (e.code === 'Escape') {
    setVisiable.value = false;
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
      v-show="setVisiable"
      class="model" 
      :style="{
        zIndex: zIndex
      }"
    >
      <div class="flex__center flex1">
        <div>
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
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  background: var(--model-bg-color);
}
</style>