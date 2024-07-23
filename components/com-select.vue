<script lang="ts" setup>
type Prop = {
  modelValue?: string | number;
  optionList?: Array<any>;
  placeholder?: string;
  unit?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: '--请选择--',
  modelValue: '',
  optionList: () => [],
  unit: '页'
});
const emit = defineEmits<{
  'update:modelValue': [val: number | string]
}>()

const selectRef = ref<HTMLSelectElement>();
const placeholder = toRef(() => props.placeholder);
const isValueLabelList = computed(() => {
  const item = props.optionList.find(e => (e?.label && e?.value));
  return !!item;
});
const list = toRef(() => {
  return props.optionList.flatMap((e, i) => {
    if (isValueLabelList.value) {
      return e;
    } else {
      if (i === 0) {
        return [];
      } else {
        return {
          label: `${e}${props.unit ? '/' + props.unit : ''}`,
          value: e,
        }
      }
    }
  });
});

function handleSelectChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', parseInt(target.value));
}

onUpdated(() => {
  if (selectRef.value) {
    const children = selectRef.value.children;
    
    for (let i = 0; i < children.length; i++) {
      const item = children[i] as HTMLOptionElement;
      if (item.value == props.modelValue) {
        item.selected = true;
      }
    }
  }
});

</script>
<template>
  <select ref="selectRef" @change="handleSelectChange">
    <option value="">{{ placeholder }}</option>
    <option 
      v-for="(item, index) in list" 
      :key="index"
      :value="item.value"
    >
      {{ item.label }}
    </option>
  </select>
</template>
<style scoped>
select {
  border: 1px solid var(--primary-border-color);
  border-radius: 5px;
  width: 150px;
  height: 40px;
  padding: 0 10px;
  font-size: 16px;
}
</style>