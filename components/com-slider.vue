<script lang="ts" setup>

type Prop = {
  modelValue: string | number;
  max?: number;
  min?: number;
  unit?: number;
  blockSize?: number;
}

const props = withDefaults(defineProps<Prop>(), {
  max: undefined,
  min: undefined,
  unit: undefined,
  blockSize: 20
});
const emit = defineEmits<{
  'update:modelValue': [val: string];
  'start': [];
  'end': [];
}>();

const obj = reactive({
  max: 0,
  min: 0,
  unit: 0
});
const sliderBoxRef = ref<HTMLElement | undefined>();
const boxWidth = ref(0);
const trackRef = ref();
const blockOffsetX = ref(0);

const pValue = computed(() => props.modelValue);
const blockStyle = computed(() => {
  return `translate(${blockOffsetX.value}px, -50%)`;
});
let startTrack = false;

watch(pValue, (val) => {
  blockOffsetX.value = parseFloat(val.toString());
});

function initConfig() {
  if (typeof props.max === 'undefined') {
    obj.max = boxWidth.value - props.blockSize;
  }

  if (typeof props.max === 'undefined') {
    obj.min = 0;
  }

  if (typeof props.unit === 'undefined') {
    obj.unit = Math.ceil(Math.abs(obj.max - obj.min)) / boxWidth.value;
  }

  if (props.modelValue) {
    blockOffsetX.value = parseFloat(props.modelValue.toString());
  }
}

function handleStart(e: MouseEvent) {
  if (e.button !== 0) return;
  startTrack = true;
  emit('start');
}

function handleEnd(e: MouseEvent) {
  if (e.button !== 0) return;
  startTrack = false;
  emit('end');
}

function trackMouse(e: MouseEvent) {
  if (!startTrack) {
    return;
  }
  const sizeInfo = trackRef.value?.getBoundingClientRect();
  const x = e.pageX - sizeInfo.x;
  if (x >= obj.min && x <= obj.max) {
    blockOffsetX.value = x;
    getValue();
  }
}

function getValue() {
  const res: string = formatNumberWithUnit(blockOffsetX.value, obj.unit);
  emit('update:modelValue', res);
}

function formatNumberWithUnit(number: number, unit: number): string {
  const unitDecimalPlaces = unit.toString().includes('.') ? unit.toString().split('.')[1].length : 0;
  const formattedNumber = (Math.round(number / unit) * unit).toFixed(unitDecimalPlaces);
  return parseFloat(formattedNumber).toString();
}

onNuxtReady(() => {
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('mousemove', trackMouse);
  if (sliderBoxRef.value) {
    boxWidth.value = sliderBoxRef.value.offsetWidth;
    initConfig();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', handleEnd);
  document.removeEventListener('mousemove', trackMouse);
});
</script>
<template>
  <div ref="sliderBoxRef" class="slider__box"
    :style="{
      '--block-size': `${props.blockSize}px`
    }"
  >
    <div ref="trackRef" class="slider__track"></div>
    <div
      @mousedown.stop="handleStart"
      class="slider__block"
      :style="{
        transform: blockStyle,
        transformOrigin: 'center center'
      }"
    ></div>
  </div>
</template>
<style scoped>
.slider__box {
  position: relative;
  padding: 5px 0;
}

.slider__track {
  border-radius: var(--border-radius);
  height: 10px;
  width: 100%;
  background: red;
}

.slider__block {
  width:  var(--block-size);
  height:  var(--block-size);
  border-radius: 50%;
  background: green;
  position: absolute;
  top: 50%;
  left: 0;
}
</style>