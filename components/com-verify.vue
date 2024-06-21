<script lang="ts" setup>
import type { StorageSuger as StorageSugerType } from '#imports';
import verify1 from '~/assets/verify/verify1.jpg';
import verify2 from '~/assets/verify/verify2.jpg';
import verify3 from '~/assets/verify/verify3.jpg';
import verify4 from '~/assets/verify/verify4.jpg';
import verify5 from '~/assets/verify/verify5.jpg';
import verify6 from '~/assets/verify/verify6.jpg';

const emit = defineEmits<{
  'verify': [val: boolean];
  'sendMail': []
}>();

const imageList = [verify1, verify2, verify3, verify4, verify5, verify6];
const visable = ref(false);
const sliderValue = ref(0);
const verifyRef = ref<HTMLElement | undefined>();
const verifyBoxRef = ref<HTMLElement | undefined>();
let currentImage: string = '';
const clipSize = 30;
const isVerified = ref(false);
const noticeVisable = ref(false);
let timer: ReturnType<typeof setTimeout>;
let counter: ReturnType<typeof setInterval>;
const time = ref(0);
let localStorage: StorageSugerType;
const x = ref(0);
const y = ref(0);
const boxStyle = computed(() => {
  return `position: fixed; z-index: 999; left: ${x.value}px; top: ${y.value}px`
})

const verifyCanvas: {
  ctx: CanvasRenderingContext2D | null;
  image: HTMLImageElement | null;
  width: number;
  height: number;
  clipX: number;
  clipY: number;
  clipImageData: ImageData | null
} = {
  ctx: null,
  image: null,
  width: 0,
  height: 0,
  clipX: 0,
  clipY: 0,
  clipImageData: null
}

function getImage(): string {
  const index = Math.floor(Math.random() * (5 + 1));
  return imageList[index];
}

function getClipWidthHeight() {
  const widthRandom = Math.floor(Math.random() * (verifyCanvas.width + 1));
  const heightRandom = Math.floor(Math.random() * (verifyCanvas.height + 1));
  // verifyCanvas.clipX = widthRandom > 50 ? widthRandom - 50 : widthRandom;
  // verifyCanvas.clipY = heightRandom > 50 ? heightRandom - 50 : heightRandom;
  verifyCanvas.clipX = getRandomIntInclusive(190, 200);
  verifyCanvas.clipY = getRandomIntInclusive(90, 100);
}

function loadImage() {
  verifyCanvas.image = new Image();
  verifyCanvas.image.src = currentImage;
  verifyCanvas.clipImageData = null;
  verifyCanvas.image.onload = () => {
    drawImage();
  }
}

watch(sliderValue, (val) => {
  drawImage(val * 1);
});

function drawImage(offsetX = 0) {
  const ctx = verifyCanvas.ctx;
  if (ctx && verifyCanvas.image) {
    ctx.clearRect(0, 0, verifyCanvas.width, verifyCanvas.height);
    ctx.drawImage(verifyCanvas.image, 0, 0, verifyCanvas.width, verifyCanvas.height);

    const sx = verifyCanvas.clipX;
    const sy = verifyCanvas.clipY;
    const sWidth = clipSize;
    const sHeight = clipSize;
    if (!verifyCanvas.clipImageData) {
      verifyCanvas.clipImageData = ctx.getImageData(sx, sy, sWidth, sHeight);
      // sliderValue.value = verifyCanvas.clipX;
    }

    ctx.clearRect(sx, sy, sWidth, sHeight);

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = sWidth;
    tempCanvas.height = sHeight;
    tempCtx?.putImageData(verifyCanvas.clipImageData, 0, 0);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.drawImage(tempCanvas, offsetX, sy); 
  }
}

function initCanvase() {
  const element = document.getElementById('verify') as HTMLCanvasElement;
  verifyCanvas.ctx = element?.getContext('2d');
  element.width = verifyCanvas.width;
  element.height = verifyCanvas.height;
  loadImage();
}

function handleEnd() {
  noticeVisable.value = true;
  isVerified.value = verify();
  
  if (isVerified.value) {
    timer = setTimeout(() => {
      emit('verify', isVerified.value);
      isVerified.value = false;
      sliderValue.value = 0;
      noticeVisable.value = false;
      emit('sendMail');
      close();
    }, 2000);
  } else {
    time.value = 0;
    drawImage();
    timer = setTimeout(() => {
      sliderValue.value = 0;
      noticeVisable.value = false;
    }, 2000);
  }
}

function verify() {
  const offset = 3;
  clearInterval(counter);

  if (sliderValue.value <= verifyCanvas.clipX + offset && sliderValue.value >= verifyCanvas.clipX - offset ) {
    return true;
  } else {
    return false;
  }
}

function handleStart() {
  counter = setInterval(() => {
    time.value += 0.01;
  }, 10);
}

function open() {
  visable.value = true;
  time.value = 0;
  localStorage.removeValue('verifyCode');
  currentImage = getImage();
  loadImage();

  nextTick(() => {
    if (verifyRef.value) {
      verifyCanvas.width = verifyRef.value.offsetWidth - 32;
      verifyCanvas.height = verifyRef.value.offsetHeight - 50;
      getClipWidthHeight();
      initCanvase();
    }
  });
}

function close() {
  visable.value = false;
}

function handleNoThingClose() {
  visable.value = false;
  emit('sendMail');
}

function trackTarget(e: MouseEvent) {
  console.log(trackTarget);
}

onMounted(() => {
  localStorage = new StorageSuger('localStorage');
  if (verifyBoxRef.value) {
    const pos = verifyBoxRef.value.getBoundingClientRect();
    x.value = pos.x + 50;
    y.value = pos.y;
  }
  // document.addEventListener('click', trackTarget);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  // document.removeEventListener('click', trackTarget);
});

defineExpose({
  open
});
</script>
<template>
  <div ref="verifyBoxRef" class="verify__box">
    <slot />
    <div v-if="visable" ref="verifyRef" class="verify p1" :style="boxStyle">
      <div class="verify__content">
        <div class="p-r">
          <canvas id="verify"></canvas>
        </div>
        <div v-if="noticeVisable" class="result__notice">
          <div class="flex__center wh100">
            <div v-if="isVerified" class="checkmark nowrap">
              <span class="notice__text">成功, 耗时{{ time.toFixed(2) }}s</span>
            </div>
            <div v-else class="cross">
              <span class="notice__text">失败</span>
            </div>
          </div>
        </div>
        <div class="">
          <com-slider 
            v-model="sliderValue" 
            :p-node="verifyRef"
            @close="handleNoThingClose"
            @start="handleStart" 
            @end="handleEnd"
          ></com-slider>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.verify__box {
  position: relative;
}

.verify {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -105%);
  background: var(--background-color);
  z-index: 999;
}

.verify__content {
  width: 300px;
  position: relative;
  border-radius: var(--border-radius);
}

.verify__content::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 27px);
  border-style: solid;
  border-color: var(--background-color) transparent transparent transparent;
  border-width: 6px;
}

.result__notice {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--model-deep-bg-color);
  z-index: 100;
}

.notice__text {
  display: inline-block;
  color: var(--white-color);
  position: relative;
  top: -15px;
  left: 50%;
  transform: translate(-50%, 0);
}

/* check */
.checkmark {
  width: 40px;
  height: 40px;
  display: inline-block;
  position: relative;
}
    
.checkmark::before,
.checkmark::after {
  content: '';
  position: absolute;
  height: 5px;
  background-color: green;
  border-radius: 2px;
}
    
.checkmark::before {
  width: 20px;
  top: 20px;
  left: calc(50% - 10px);
  transform: rotate(45deg) translateX(-50%);
  transform-origin: left bottom;
  animation: drawCheckmarkBefore 0.5s ease forwards;
}
    
.checkmark::after {
  width: 30px;
  top: 27px;
  left: 19px;
  transform: rotate(-45deg);
  transform-origin: left bottom;
  animation: drawCheckmarkAfter 0.5s ease forwards;
  animation-delay: 0.3s;
}
    
@keyframes drawCheckmarkBefore {
  0% {
    width: 0;
  }
  100% {
    width: 20px;
  }
}
    
@keyframes drawCheckmarkAfter {
  0% {
    width: 0;
  }
  100% {
    width: 30px;
  }
}
/* */

/* cross */
.cross {
  width: 40px;
  height: 40px;
  display: inline-block;
  position: relative;
}
      
.cross::before,
.cross::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 5px;
  background-color: red;
  border-radius: 2px;
  top: 20px;
  left: 0;
}
      
.cross::before {
  transform: rotate(45deg);
  transform-origin: center;
  animation: drawCross 0.5s ease forwards;
}
      
.cross::after {
  transform: rotate(-45deg);
  transform-origin: center;
  animation: drawCross 0.5s ease forwards;
  animation-delay: 0.3s;
}
      
@keyframes drawCross {
  0% {
    width: 0;
  }
  100% {
    width: 40px;
  }
}
/* */
</style>