<script lang="ts" setup>

type Prop = {
  modelValue: string | number;
  max?: number;
  min?: number;
  unit?: number;
  blockSize?: number;
  pNode?: HTMLElement
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
  'close': [];
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

const pRef = computed(() => props.pNode);
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

function handleStart(e: Event) {
  // if (e.button !== 0) return;
  const target = e.target as HTMLElement;
  
  if (pRef.value && pRef.value.contains(target)) {
    startTrack = true;
    emit('start');
  } else {
    emit('close');
  }
}

function handleEnd(e: Event) {
  // if (e.button !== 0) return;
  if (!(pRef.value && pRef.value.contains(e.target as HTMLElement))) {
    emit('close');
  }

  if (!startTrack) {
    return;
  }
  startTrack = false;
  emit('end');
}

function trackMouse(e: MouseEvent | TouchEvent) {
  e.preventDefault();

  if (!startTrack) {
    return;
  }

  if (isMouseEvent(e)) {
    const sizeInfo = trackRef.value?.getBoundingClientRect();
    const x = e.pageX - sizeInfo.x;
    if (x >= obj.min && x <= obj.max) {
      blockOffsetX.value = x;
      getValue();
    }
  }

  if (isTouchEvent(e)) {
    const sizeInfo = trackRef.value?.getBoundingClientRect();
    const x = e.touches[0].pageX - sizeInfo.x;
    if (x >= obj.min && x <= obj.max) {
      blockOffsetX.value = x;
      getValue();
    }
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
  document.addEventListener('touchmove', trackMouse);
  document.addEventListener('touchend', handleEnd);
  if (sliderBoxRef.value) {
    boxWidth.value = sliderBoxRef.value.offsetWidth;
    initConfig();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', handleEnd);
  document.removeEventListener('mousemove', trackMouse);
  document.removeEventListener('touchmove', trackMouse);
  document.removeEventListener('touchend', handleEnd);
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
      @touchstart.stop="handleStart"
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
  background: var(--white-color);
}

.slider__block {
  width:  var(--block-size);
  height:  var(--block-size);
  border-radius: 50%;
  background: var(--primary-color);
  position: absolute;
  top: 50%;
  left: 0;
}
</style>