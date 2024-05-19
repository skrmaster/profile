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

const placeholder = toRef(() => props.placeholder);
const list = toRef(() => {
  return props.optionList.flatMap((e, i) => {
    if (i === 0) {
      return [];
    } else {
      return {
        label: `${e}/${props.unit}`,
        value: e,
      }
    }
  });
});

function handleSelectChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', parseInt(target.value));
}

</script>
<template>
  <div>
    <select @change="handleSelectChange">
      <option value="">{{ placeholder }}</option>
      <option 
        v-for="(item, index) in list" 
        :key="index"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>
  </div>
</template>
<style scoped>
select {
  border: 1px solid var(--primary-border-color);
  border-radius: 5px;
}
</style>