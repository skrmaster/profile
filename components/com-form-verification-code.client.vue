<script lang="ts" setup>
type Prop = {
  modelValue: string;
  placeholder?: string;
  autocomplete?: string;
  type?: string;
  width?: string | number;
  clearable?: boolean;
  disable?: boolean;
  readonly?: boolean;
  isError?: boolean;
  errorMsg?: string;
  isLabel?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: '请输入内容',
  autocomplete: 'off',
  width: '100%',
  clearable: false,
  disable: false,
  readonly: false,
  isError: false,
  isLabel: true
});

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>();

const time = 10;
const code = ref('');
const text = '发送验证码';
const start = ref(false);
const countdown = ref(time);
let counter: ReturnType<typeof setTimeout>;
const localStorage = new StorageSuger('localStorage');

function running() {
  return setTimeout(() => {
    countdown.value--;
    localStorage.setValue('verifyCode', countdown.value);
    if (countdown.value === 0) {
      clearTimeout(counter);
      start.value = false;
      countdown.value = time;
      localStorage.removeValue('verifyCode');
    } else {
      running();
    }
  }, 1000);
}

function handleClick() {
  if (start.value) {
    return;
  }
  start.value = true;
  counter = running();
  fetchCode();
}

function fetchCode() {

}

function handleCodeData() {
  emit('update:modelValue', code.value);
}

onMounted(() => {
  const existTime = localStorage.getValue('verifyCode');
  if (existTime) {
    countdown.value = parseInt(existTime as string);
    handleClick();
  }
})
</script>
<template>
  <div class="verification">
    <div class="verification__input">
      <com-form-input 
        v-model="code" 
        clearable 
        type="text" 
        :is-error="props.isError"
        :error-msg="props.errorMsg"
        :is-label="props.isLabel"
        width="100%"
        placeholder="请填写验证码"
        @change="handleCodeData"
      ></com-form-input>
    </div>
    <div class="verification__btn">
      <com-button plain @click="handleClick" class="nowrap">
        {{ start ? `${countdown}s` : text }}
      </com-button>
    </div>
  </div>
</template>
<style scoped>
.verification {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-flow: row nowrap
}

.verification__input {
  flex: 2;
}

.verification__btn {
  flex: 1;
  margin-left: 10px;
}
</style>