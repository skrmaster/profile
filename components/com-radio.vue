<script lang="ts" setup>
type Prop = {
  modelValue?: string;
  list?: LabelValue[];
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: '',
  list: () => []
});

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>();
const value = toRef(() => props.modelValue);
const renderList = toRef(() => props.list);

function handleValue(val: string) {
  emit('update:modelValue', val);
}

</script>
<template>
  <div class="radio">
    <div class="flex__row">
      <div
        v-for="(item, index) in renderList"
        :key="index"
        class="radio__item flex__row"
        :class="{
          'active': value === item.value
        }"
        @click="handleValue(item.value)"
      >
        <label class="flex__row c-p">
          <span class="radio__input flex__center">
            <input 
              class="input--origin" 
              type="radio" 
              :name="item.label" 
              :value="item.value"
            />
            <span class="input__active"></span>
          </span>
          <span class="radio__label">{{ item.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
<style scoped>
.radio {
  margin: 0 -8px;
}

.radio__input {
  display: inline-flex;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--white-color);
  margin-right: 5px;
}

.input--origin {
  opacity: 0;
  outline: none;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
}

.radio__label {
  font-size: 16px;
}

.radio__item {
  margin: 0 8px;
}

.radio__item.active .input__active {
  display: inline-flex;
}

.radio__item.active .radio__label {
  font-weight: bold;
}

.input__active {
  display: none;
  width: 10px;
  height: 10px;
  background: var(--primary-color);
  border-radius: 50%;
}
</style>