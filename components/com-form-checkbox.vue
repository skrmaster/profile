<script lang="ts" setup>
type Prop = {
  modelValue?: boolean;
  label?: string;
}
const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  label: ''
})
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
}>();

const id = useId();
const inputCheckValue = ref(false);
const checkedValue = computed((): boolean => {
  return props.modelValue || inputCheckValue.value
})

function handleChange($event: Event) {
  const _target = $event.target as HTMLInputElement;
  const res = _target.checked;
  inputCheckValue.value = res;
  emit('update:modelValue', res);
}
</script>
<template>
  <div class="checkbox__box">
    <div class="c-p p-r flex">
      <input 
        class="c-p"
        :id="id" 
        :name="`${props.label}`" 
        type="checkbox" 
        :checked="checkedValue" 
        @input="handleChange" 
      />
      <div 
        v-show="checkedValue" 
        class="cover__checkbox"
      >
        <span class="cover__checkbox-inner"></span>
      </div>
    </div>
    <label class="gap c-p" :class="{
      checked: checkedValue
    }" :for="id">
      {{ props.label }}
    </label>
  </div>
</template>
<style scoped>
.checkbox__box {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.gap {
  margin-left: 3px;
  font-size: 14px;
}

.gap::selection {
  background: var(--white-color);
}

input {
  width: 14px;
  height: 14px;
}

.cover__checkbox {
  position: absolute;
  top: 0;
  left: 0;
  width: 14px;
  height: 14px;
  background: var(--primary-color);
  border-radius: 2px;
  pointer-events: none;
}

.cover__checkbox-inner {
  position: relative;
}

.cover__checkbox-inner::before{
  box-sizing: content-box;
  content: "";
  border: 2px solid transparent;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4.8px;
  position: absolute;
  top: 1.4px;
  width: 3px;
  transition: transform .15s ease-in .05s;
  transform-origin: center;
  transform: rotate(45deg) scaleY(1);
  border-color: var(--white-color);
  z-index: 2;
}

.cover__checkbox-inner::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  top: 0;
  left: 0;
  z-index: 3;
  background: var(--primary-color);
  transition: all 12s;
  transform-origin: right;
  animation: presence2absence .2s ease-in-out 0.1s 1 normal forwards running;
}

label.checked {
  font-weight: bold;
}
</style>