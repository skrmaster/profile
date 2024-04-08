<script lang="ts" setup>
interface Props {
  placeholder?: string;
  autocomplete?: string;
  type?: string;
  width?: string | number;
  clearable?: boolean;
  disable?: boolean;
  readonly?: boolean;
}

enum Status {
  'hide' = 0,
  'show'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容',
  autocomplete: 'off',
  type: 'text',
  width: '300px',
  clearable: false,
  disable: false,
  readonly: false
});

const inputValue = ref('');
const placeholderStatus = ref<Status>(1);
const isInputFocus = ref(false)
const width = computed(() => {
  if (!isNaN(props.width as number * 1)) {
    return props.width + 'px'
  } else {
    return props.width
  }
})

function autoSetStatusOfPlaceholder() {
  if (inputValue.value && inputValue.value.length > 0) {
    placeholderStatus.value = 0;
  } else {
    placeholderStatus.value = 1;
  }
}

function handlerChange() {
  autoSetStatusOfPlaceholder();
}

function handlerFocus() {
  isInputFocus.value = true;
  autoSetStatusOfPlaceholder();
}

function handlerBlur() {
  isInputFocus.value = false;
  autoSetStatusOfPlaceholder();
}

</script>
<template>
  <div 
    class="form__input-box"
    :class="{
      'form__input-box--active': isInputFocus
    }"
    :style="{
      'width': width
    }"
  >
    <slot name="prepend"></slot>
    <input 
      class="form__input-field"
      autocomplete="off"
      type="text"
      v-model="inputValue"
      @change="handlerChange"
      @focus="handlerFocus"
      @blur="handlerBlur"
    />
    <span class="form__placeholder" 
      :class="{
        'form__placeholder--active': placeholderStatus === 0 || isInputFocus
      }"
    >{{ props.placeholder }}</span>
    <svg class="icon " aria-hidden="true">
      <use xlink:href="#icon-profilea-ziyuan37close-circle"></use>
    </svg>
    <slot name="append"></slot>
  </div>
</template>
<style scoped>
.form__input-box {
  display: flex;
  position: relative;
  padding: 0 10px;
  border-color: var(--input-border-color);
  border-width: 1.2px;
  border-style: solid;
  border-radius: 4px;
}

.form__input-box--active {
  outline: 2px solid #c3c1c6;
  border-color: var(--primary-color);
}

.form__input-field {
  font-size: 18px;
  width: 100%;
  height: 50px;
  border: 0;
  outline: 0;
}

.form__placeholder {
  font-size: 18px;
  color: #999999;
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translate(0, -50%);
  user-select: none;
  pointer-events: none;
  transition: all .2s;
}

.form__placeholder--active {
  font-size: 12px;
  padding: 3px;
  color: var(--primary-color);
  top: 0;
  left: 10px;
  transform: translate(0, -50%);
  background: #FFFFFF;
}
</style>