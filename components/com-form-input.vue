<script lang="ts" setup>
interface Props {
  modelValue: string;
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
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const input = ref();
const prepend = ref();

const inputValue = ref('');
const placeholderStatus = ref<Status>(1);
const isInputFocus = ref(false);
const canShowClearIcon = ref(false);
const positionOfPlaceholder = ref(10);

const width = computed((): string | number => {
  if (!isNaN(props.width as number * 1)) {
    return props.width + 'px';
  } else {
    return props.width;
  }
});

watch(inputValue, (val: string) => {
  if (val.length > 0 && props.clearable) {
    canShowClearIcon.value = true;
  } else {
    canShowClearIcon.value = false;
  }
});

onMounted(() => {
  if (prepend.value) {
    positionOfPlaceholder.value += prepend.value.offsetWidth
  }
})

function autoSetStatusOfPlaceholder() {
  if (inputValue.value && inputValue.value.length > 0) {
    placeholderStatus.value = 0;
  } else {
    placeholderStatus.value = 1;
  }
}

function handlerContent() {    
  autoSetStatusOfPlaceholder();
  emit('update:modelValue', inputValue.value);
}

function handlerFocus() {
  isInputFocus.value = true;
  autoSetStatusOfPlaceholder();
}

function handlerBlur() {
  isInputFocus.value = false;
  autoSetStatusOfPlaceholder();
}

 function handlerClear() {
  inputValue.value = '';
  input.value.focus();
 }

</script>
<template>
  <div
    :class="{
      'form__input-box': true,
      'form__input-box--active': isInputFocus
    }"
    :style="{
      'width': width,
      '--input-placeholder-gap': `${positionOfPlaceholder}px`
    }"
  >
    <div ref="prepend">
      <slot name="prepend"></slot>
    </div>
    <input 
      ref="input"
      class="form__input-field"
      autocomplete="off"
      type="text"
      v-model="inputValue"
      @input="handlerContent"
      @focus="handlerFocus"
      @blur="handlerBlur"
    />
    <span
      :class="{
        'form__placeholder': true,
        'form__placeholder--active': placeholderStatus === 0 || isInputFocus
      }"
    >{{ props.placeholder }}</span>
    <svg 
      v-if="canShowClearIcon" 
      class="icon" 
      aria-hidden="true"
      @click.stop="handlerClear"
    >
      <use xlink:href="#icon-profilea-ziyuan37close-circle"></use>
    </svg>
    <slot name="append"></slot>
  </div>
</template>
<style scoped>
.form__input-box {
  display: flex;
  align-items: center;
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
  flex: 1;
}

.form__placeholder {
  font-size: 18px;
  color: #999999;
  position: absolute;
  top: 50%;
  left: var(--input-placeholder-gap);
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

.error--shake {
  animation: shake .5s linear 1s 1 normal none running;
}
</style>