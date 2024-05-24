<script lang="ts" setup>
interface Props {
  modelValue?: string | number;
  placeholder?: string;
  autocomplete?: string;
  type?: string;
  width?: string | number;
  clearable?: boolean;
  disable?: boolean;
  readonly?: boolean;
  isError?: boolean;
  errorMsg?: string;
  maxLength?: number;
  minLength?: number;
  minValue?: number;
  maxValue?: number;
  rows?: number;
  isLabel?: boolean;
  textAlign?: 'start' | 'center' | 'end';
}

enum Status {
  'hide' = 0,
  'show'
}

const props = withDefaults(defineProps<Props>(), {
  isLabel: true,
  placeholder: '请输入内容',
  autocomplete: 'off',
  type: 'text',
  width: '100%',
  clearable: false,
  disable: false,
  readonly: false,
  isError: false,
  minValue: 0,
  rowsValue: 2,
  textAlign: 'start'
});
const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined],
  'change': [value: string | number | undefined]
}>();

const input = ref();
const prepend = ref();

const placeholderStatus = ref<Status>(1);
const isInputFocus = ref(false);
const canShowClearIcon = ref(false);
const positionOfPlaceholder = ref(10);
const showPasswordType = ref('password');
const inputValue = toRef(() => props.modelValue);
const currentInputValue = ref<string | number | undefined>();

const isTypePassword = computed((): boolean => {
  return props.type !== 'password';
});

const isError = computed((): boolean => {
  return props.isError;
})

const width = computed((): string | number => {
  if (!isNaN(props.width as number * 1)) {
    return props.width + 'px';
  } else {
    return props.width;
  }
});

watch(inputValue, (val) => {
  currentInputValue.value = val;  
  
  if (currentInputValue.value?.toString()) {
    placeholderStatus.value = 0;
  } else {
    placeholderStatus.value = 1;
  }
});

watchEffect(() => {
  if (currentInputValue.value && props.clearable) {
    canShowClearIcon.value = true;
  } else {
    canShowClearIcon.value = false;
  }
});

onMounted(() => {
  if (prepend.value) {
    positionOfPlaceholder.value += prepend.value.offsetWidth
  }

  if (input.value.value.toString()) {
    placeholderStatus.value = 0;
  }

  if (inputValue.value) {
    currentInputValue.value = inputValue.value;  
    placeholderStatus.value = 0;
  }
});

function autoSetStatusOfPlaceholder() {
  if (currentInputValue.value?.toString()) {
    placeholderStatus.value = 0;
  } else {
    placeholderStatus.value = 1;
  }
}

function handlerContent() {
  autoSetStatusOfPlaceholder();
  emit('update:modelValue', unref(currentInputValue));
  emit('change', unref(currentInputValue));
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
  emit('update:modelValue', '');
  currentInputValue.value = '';  
  input.value.focus();
}

function handlePasswordIcon() {
  showPasswordType.value === 'password'
  ? showPasswordType.value = 'text'
  : showPasswordType.value = 'password'
}

</script>
<template>
  <div
    class="form__input-box"
    :class="{
      'form__input-box--active': isInputFocus,
      'error error--shake': isError,
    }"
    :style="{
      'max-width': width,
      'width': '100%',
      '--input-placeholder-gap': `${positionOfPlaceholder}px`
    }"
  >
    <slot ref="prepend" name="prepend"></slot>
    <label
      v-if="props.isLabel"
      :class="{
        'form__placeholder': true,
        'form__placeholder--active': placeholderStatus === 0 || isInputFocus,
        'form__placeholder--textarea': props.type === 'textarea'
      }"
    >
      {{ 
        (props.isError && currentInputValue && props.errorMsg) 
          ? props.errorMsg 
          : props.placeholder 
      }}
    </label>
    <input
      v-if="props.type !== 'textarea'"
      ref="input"
      class="form__input-field"
      :class="{
        'no-label': !props.isLabel
      }"
      :style="{
        textAlign: props.textAlign,
        textIndent: props.textAlign === 'start' ? '0.5em' : 'auto'
      }"
      :placeholder="props.placeholder"
      :max="props.maxValue"
      :min="props.minValue"
      :autocomplete="props.autocomplete"
      :type="isTypePassword ? props.type : showPasswordType"
      v-model="currentInputValue"
      @input="handlerContent"
      @focus="handlerFocus"
      @blur="handlerBlur"
    />
    <textarea v-else
      ref="input"
      class="form__input-field"
      :class="{
        'no-label': !props.isLabel
      }"
      :placeholder="props.placeholder"
      v-model="currentInputValue"
      :max-length="props.maxLength"
      :min-length="props.minLength"
      :rows="`${props.rows}`"
      @input="handlerContent"
      @focus="handlerFocus"
      @blur="handlerBlur"
    >

    </textarea>
    <com-icon
      class="mr1"
      v-if="props.type === 'password' && (currentInputValue && currentInputValue.toString().length > 0)"
      @click="handlePasswordIcon"
      :icon="showPasswordType !== 'password' ? 'profile-see' : 'profile-no-see'"
    ></com-icon>
    <com-icon
      class="clear__icon mr1"
      v-if="canShowClearIcon"
      @click.stop="handlerClear"
      icon="profile-circle-close"
    ></com-icon>
    <slot name="append"></slot>
  </div>
</template>
<style scoped>
.form__input-box {
  display: flex;
  align-items: center;
  position: relative;
  border-color: var(--input-border-color);
  border-width: 1.2px;
  border-style: solid;
  border-radius: 4px;
  background: var(--white-color);
  min-height: 50px;
}

.form__input-box--active {
  outline: 2px solid #c3c1c6;
  border-color: var(--primary-color);
}

.form__input-box.error {
  border-color: var(--error-color);
  outline-color: var(--error-color-rgba);
}

.form__input-field {
  min-height: 48px;
  border-radius: 5px;
  font-size: 18px;
  width: 100%;
  border: 0;
  outline: 0;
  flex: 1;
}

textarea.form__input-field {
  padding: 10px 0;
  text-indent: 0.5em;
  background: transparent;
  height: auto;
}

.form__input-field:not(.no-label)::placeholder {
  visibility: hidden;
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

.form__placeholder--textarea {
  top: 20px;
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

.form__input-box.error .form__placeholder {
  color: var(--error-color);
}

.error--shake {
  animation: shake .5s linear 0.1s 1 normal none running;
}

.clear__icon {
  display: none;
}

.form__input-box:hover .clear__icon{
  display: block;
}
</style>