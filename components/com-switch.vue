<script lang="ts" setup>
type Prop = {
  modelValue: string | number;
  activeLabel?: string;
  inActiveLabel?: string;
}

const emit = defineEmits<{
  'update:modelValue': [val: string | number]
}>();
const props = withDefaults(defineProps<Prop>(), {
  activeLabel: '',
  inActiveLabel: ''
});

const propsModelValue = computed(() => {
  return props.modelValue;
});

watch(propsModelValue, (val: string | number) => {
  if (typeof val === 'string') {
    start.value = val === '0' ? false : Boolean(val);
  } else {
    start.value = !!val;
  }
});
const start = ref(false);

function handleStart() {
  start.value = !start.value;
  emit('update:modelValue', start.value ? 1 : 0);
}

</script>
<template>
  <div class="flex__row">
    <span class="switch__label" :class="{
      active: !start
    }">{{ props.inActiveLabel }}</span>
    <button 
      name="button" 
      type="button" 
      class="theme__btn c-p"
      @click="handleStart"
      :class="{
        active: start
      }"
    >
      <div class="theme__content flex__center"
        :class="{
          'transition': start
        }"
      >
        <span class="switch__block"></span>
      </div>
    </button>
    <span class="switch__label" :class="{
      active: start
    }">{{ props.activeLabel }}</span>
  </div>
</template>
<style scoped>
.theme__btn {
  height: 28px;
  width: 50px;
  border: 1px solid transparent;
  border-radius: 28px;
  background: var(--switch-primary-color);
  margin: 0 5px;
}

.switch__label {
  font-size: 14px;
  color: var(--switch-primary-color);
}

.switch__label.active {
  color: var(--primary-color);
  font-weight: bold;
}

.switch__block {
  border-radius: 50%;
  background-color: var(--white-color);
  width: 16px;
  height: 16px;
}

.theme__btn.active {
  background-color: var(--primary-color);
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