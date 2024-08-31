<script lang="ts" setup>
import roadPath from 'assets/json/road.json';
import benchSvg from 'assets/svg/park-bench.svg';
import ligthOnSvg from 'assets/svg/light-on.svg';
import ligthOffSvg from 'assets/svg/light-off.svg';
import walking from 'assets/json/walkMan.json';
import type { AddModel } from '~/api/message/model';
import { apiAdd } from '~/api/message/request';

type Park = {
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  horizon: number;
}

useSeoMeta({
  title: `skrmaster-个人网站`,
  description: `一个记录个人技术成长的网站,${import.meta.env.VITE_PROJECT_DOMAIN},专注前端开发`,
  keywords: 'skrmaster,首页,个人首页,个人网站,skr,threejs,nuxtjs,nuxt3,nuxt,vue,vue3,vue3+ts,ts,typescript,记录,博客,踩坑,前端,web开发,ssr,服务端渲染的个人网站,服务端渲染',
  ogTitle: `skrmaster-个人网站`,
  ogDescription: `一个记录个人技术成长的网站,${import.meta.env.VITE_PROJECT_DOMAIN},专注前端开发`,
  ogImage: `https://${import.meta.env.VITE_PROJECT_DOMAIN}/images/og-image.png`,
  ogUrl: `https://${import.meta.env.VITE_PROJECT_DOMAIN}`,
  ogType: 'website',
  ogSiteName: 'skrmaster'
});

const roadData = roadPath.data;
const walkData = walking.data;
const { $message, $worker } = useNuxtApp();
let worker: Worker;
const themeState = useState('theme');
const theme = computed(() => themeState.value);
const startAnimate = ref(false);
const parkCanvasRef = ref();
let once = false;

watch(theme, (val) => {
  if (val) {
    changeLight(val as string);
  }
});

watch(parkCanvasRef, () => {
  if (!once && parkCanvasRef.value) {
    loadResource();
  }
});

const windowWidth = ref(0);
const formConfig: Array<FormConfig> = [
  {
    require: true,
    field: 'userName',
    type: 'text',
    rule: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入姓名',
      clearable: true,
    }
  },
  {
    require: true,
    field: 'contactWay',
    type: 'text',
    rule: '',
    elementConfig: {
      width: '100%',
      placeholder: '联系方式',
      clearable: true,
    }
  },
  {
    require: true,
    field: 'content',
    type: 'textarea',
    rule: '',
    elementConfig: {
      width: '100%',
      placeholder: '内容',
      clearable: false,
      maxLength: 200,
      rows: 8,
    }
  }
];
const parkScale = ref(1);
const parkTransform = computed(() => {
  return `scale(${parkScale.value})`;
});

const road = {
  width: 642,
  height: 573,
  gap: -55,
  count: 0,
}

const parkCanvas: Park = {
  ctx: null,
  width: 0,
  height: 0,
  horizon: 0,
}
const bench = {
  width: 698,
  height: 313,
  smallWidth: 523,
  smallHeight: 239,
}

const grass = {
  count: 0,
  width: 564,
  height: 564,
  gap: 110,
}

let tmpCanvas: HTMLCanvasElement | null;
let man = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  stepX: 0,
  stepY: 0,
  stepYDiff: 0,
  countY: 0,
  sitingTime: 100,
  walkWidth: 0,
  timeControl: 0,
  walkToSitingWaitTime: 10,
  sitingToWalkToWaitTime: 10,
  walkStep: 0,
  walkFrameTime: 0,
}

let walkingImage = reactive({
  x: -250,
  y: 0,
  time: 0,
  data: '',
  sitingTime: 2000,
  walkToSitingWaitTime: 100,
  sitingToWalkToWaitTime: 100,
  walkWidth: 0
});

const timer: {
  [key in string]: ReturnType<typeof setTimeout> | undefined
} = {
  lastFrameTimer: undefined,
}

const requestTimer: {
  [key in string]: ReturnType<typeof requestAnimationFrame> | undefined
} = {
  animateTimerTop: undefined,
  animateTimerTop1: undefined,
  animateTimerTop2: undefined,
  animateTimerTop3: undefined,
  animateTimerTop4: undefined,
  animateTimerTop5: undefined,
  animateTimerTop6: undefined,
  animateTimerTop7: undefined
}

let scrollBarWidth: number;
let img: HTMLImageElement;
let lightImg: HTMLImageElement;

function clearAnimate() {
  for (let item in timer) {
    clearTimeout(timer[item]);
  }

  for (let item in requestTimer) {
    if (!isUndefined(requestTimer[item])) {
      window.cancelAnimationFrame(requestTimer[item] as number);
    }
  }
}

async function initCanvas() {
  scrollBarWidth = getScrollBarWidth();
  clearAnimate();
  worker?.terminate();
  worker = $worker();
  worker.postMessage({ command: 'clear' });

  man = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    stepX: 0,
    stepY: 0,
    stepYDiff: 0,
    countY: 0,
    sitingTime: 100,
    walkWidth: 0,
    timeControl: 0,
    walkToSitingWaitTime: 10,
    sitingToWalkToWaitTime: 10,
    walkStep: 0,
    walkFrameTime: 0,
  }

  walkingImage.x = -250;
  walkingImage.data = '';
  walkingImage.time = 0;
  walkingImage.sitingTime = 2000;
  walkingImage.walkToSitingWaitTime = 100;
  walkingImage.sitingToWalkToWaitTime = 100;
  startAnimate.value = false;

  man.timeControl = 0;
  man.sitingTime = 100;
  man.walkToSitingWaitTime = 10;
  man.sitingToWalkToWaitTime = 10;

  windowWidth.value = window.innerWidth;
  man.width = 110;
  man.height = 200;
  man.stepX = 110;

  const canvas = document.getElementById('park') as HTMLCanvasElement;
  if (!canvas) {
    return;
  }

  if (windowWidth.value <= 992) {
    let reallyWidth = windowWidth.value;
    let w = 992;
    parkScale.value = reallyWidth / w;

    canvas.width = w - scrollBarWidth - 1;
    canvas.height = 1006;
  } else {
    parkScale.value = 1;
    canvas.width = windowWidth.value - scrollBarWidth - 1;
    canvas.height = 1006;
  }
  
  parkCanvas.width = canvas.width;
  parkCanvas.height = canvas.height;
  road.count = Math.ceil((windowWidth.value + 50) / road.width);
  grass.count = Math.ceil(windowWidth.value / grass.width);

  man.walkWidth = canvas.width;
  man.stepY = parkCanvas.height + 100;
  man.stepYDiff = (parkCanvas.height - man.height - 150 * 2) - man.stepY;
  man.countY = man.walkWidth / 2 / man.stepX;
  man.y = windowWidth.value <= 992 ? (parkCanvas.height - man.height - 280) + (man.stepYDiff / man.countY) : (parkCanvas.height - man.height - 320) + (man.stepYDiff / man.countY);
  walkingImage.walkWidth = windowWidth.value;
   
  if (windowWidth.value <= 992) {
    walkingImage.y = (canvas.height * parkScale.value) / 2 - 450 / 4; 
  } else {
    walkingImage.y = man.y;
  }

  parkCanvas.ctx = canvas.getContext('2d');
  parkCanvas.horizon = (canvas.height * parkScale.value) / 2;

  parkCanvas.ctx?.clearRect(0, 0, 5000, 5000);
  worker.onmessage = (event: MessageEvent) => {
    const imageBitmap = event.data as ImageBitmap;
    parkCanvas.ctx?.clearRect(0, 0, 5000, 5000);
    parkCanvas.ctx?.drawImage(imageBitmap, 0, 0);
  };
    
  tmpCanvas = document.createElement('canvas');
  const offscreenCanvas = tmpCanvas.transferControlToOffscreen();
  const imgData = await createImageBitmap(img, 0, 0, img.width, img.height);
  const lightImgData = await createImageBitmap(lightImg, 0, 0, lightImg.width, lightImg.height);
  const parkCloneCanvas = {
    ...parkCanvas,
    ctx: offscreenCanvas
  }

  const themeType = theme.value;

  worker.postMessage({
    parkCloneCanvas,
    man,
    timer,
    requestTimer,
    bench,
    walkData,
    roadData,
    imgData,
    lightImgData,
    themeType
  }, [parkCloneCanvas.ctx]);
}

function changeLight(val: string) {
  if (lightImg && lightImg.src) {
    lightImg.src = val === 'light' ? ligthOffSvg : ligthOnSvg;
    lightImg.onload = () => {
      initCanvas();
    }
  }
}

function loadResource() {
  img = new Image();
  img.src = benchSvg;
  once = true;

  img.onload = () => {
    lightImg = new Image();
    lightImg.src = theme.value === 'light' ? ligthOffSvg : ligthOnSvg;

    lightImg.onload = () => {
      initCanvas();
    }
  }
}

const formRef = ref();
const btnLoading = ref(false);
function handleAddMessage() {
  formRef.value.vaildForm().then((val: ReturnVaildForm) => {
    if (val.vaild) {
      const params: AddModel = {
        userName: val.data.userName,
        contactWay: val.data.contactWay,
        content: val.data.content
      }
      btnLoading.value = true;
      apiAdd(params).then(res => {
        btnLoading.value = false;
        if (res.succeeded) {
          $message.show({
            message: '提交成功',
            type: 'success'
          });
        } else {
          $message.show({
            message: '提交失败',
            type: 'error'
          });
        }
      }).catch(e => {
        btnLoading.value = false;
      });
    }
});
}

onNuxtReady(() => {
  const resizeHandler = debounce(initCanvas, 500);
  window.addEventListener('resize', () => {
    resizeHandler();
  });
});

onBeforeUnmount(() => {
  clearAnimate();
});

</script>
<template>
  <NuxtLayout name="header-section-footer">
    <section class="p-r overflow-hidden">
      <canvas 
        ref="parkCanvasRef"
        :style="{
          'transform-origin': 'top left',
          'transform': parkTransform
        }" 
        id="park" 
        class="z-index2"
      ></canvas>
      <div class="section-bg gaussian-blur z-index3"></div>
      <div class="container z-index4">
        <div class="introduction" :class="{
          'introducion-small': windowWidth < 992
        }">
          <div class="flex__center flex-wrap introduciton-text-height">
            <div class="fs48 text-right self-introduction">
              <p>嗨,</p>
              <p class="my1">我是<span class="font-bold fs60">郑洋</span></p>
              <p class="fs24">前端开发工程师</p>
            </div>
            <div class="section__avatar">
              <div class="avatar__box mx-auto">
                <!-- <img src="" alt="avatar" /> -->
              </div>
            </div>
            <div class="p-r p1">
              <div>
                <p class="fs18">介绍</p>
                <p class="detail fs24 my2">
                  专注于使用<span class="font-bold">Vuejs</span>进行中后台系统
                  开发、组件二次封装、<span class="font-bold">SSR</span>网站
                  前端开发等等...
                </p>
                <com-button suffix-icon="profile-arrow" link><NuxtLink class="fs18" to="#skills" style="color: var(--primary-color);">了解更多</NuxtLink></com-button>
              </div>
              <div v-if="theme !== 'dark' && windowWidth > 1252" class="introduction__bg"></div>
            </div>
          </div>
        </div>
        <div v-if="windowWidth > 578 && windowWidth < 992" class="introducion-seat"></div>
      </div>
    </section>
    <index-skills v-if="windowWidth >= 992" :width="windowWidth"></index-skills>
    <index-skills-small v-else></index-skills-small>
    <index-projects :width="windowWidth"></index-projects>
    <div class="container">
      <div class="text-center contact__me">
        <p class="fs48">联系我</p>
        <p class="fs18 text-uppercase">contact me</p>
      </div>
      <div class="contact my5">
        <div class="contact__item flex__column--center">
          <com-icon width="60px" height="60px" icon="profile-phone"></com-icon>
          <p class="contact__item-gap fs24">电话</p>
          <p class="fs30">+8618283170317</p>
        </div>
        <div class="contact__item flex__column--center contact__borderx">
          <com-icon width="60px" height="60px" icon="profile-wechat"></com-icon>
          <p class="contact__item-gap fs24">微信</p>
          <p class="fs30">skrMogul</p>
        </div>
        <div class="contact__item flex__column--center">
          <com-icon width="60px" height="60px" icon="profile-email"></com-icon>
          <p class="contact__item-gap fs24">邮箱</p>
          <p class="fs30 flex__row">
            <span style="word-break: break-all;">18283170317zy@gmail.com</span>
          </p>
        </div>
      </div>
      <ClientOnly>
        <com-form ref="formRef" class="index__form mx-auto pb4" :model="formConfig">
          <div class="flex__center">
            <com-button class="submit-btn fs20" :loading="btnLoading" is-ripple @click="handleAddMessage">提交</com-button>
          </div>
        </com-form>
      </ClientOnly>
    </div>
  </NuxtLayout>
</template>
<style scoped>
#park {
  position: absolute;
  top: 0;
  left: 0;
}

.introduction {
  height: 1006px;
  /* height: 100%; */
  margin-bottom: 3em;
}

.introducion-small {
  height: 100%;
}

.introducion-seat {
  height: 300px;
}

.introduciton-text-height {
  height: 550px;
  color: var(--primary-color);
}

.introduction__bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: var(--white-color);
  opacity: 0.4;
  filter: blur(10px); 
  z-index: -1;
}

.section__avatar {
  max-width: 503px;
  width: 100%;
}

.avatar__box {
  max-width: 363px;
  max-height: 363px;
  width: 100%;
  height: 100%;
  min-width: 150px;
  min-height: 150px;
}

.avatar__box img {
  max-width: 100%;
  max-height: 100%;
}

.self-introduction ,.detail {
  max-width: 350px;
  width: 100%;
}

.section-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.contact__me {
  color: var(--primary-color);
}

.contact {
  display: flex;
  flex-flow: row wrap;
}

.contact__item {
  flex: 1;
  max-width: 500px;
  width: 100%;
  height: 338px;
  min-width: 300px;
  margin: 0 auto;
  color: var(--primary-color);
}

.contact__icon {
  height: 60px;
  width: 60px
}

.contact__item-gap {
  margin-top: 15px;
  margin-bottom: 50px;
}

.index__form {
  max-width: 622px;
  width: 100%;
}

:deep(.index__form .form__input-box) {
  border-style: dashed!important;
  background: var(--white-color)!important;
}

:deep(.index__form .form__input-box .form__placeholder--active) {
  background: var(--white-color)!important;
}

:deep(.index__form .form__input-box input) {
  background: var(--white-color)!important;
}

.submit-btn {
  width: 150px;
  height: 52px;
}

.walking {
  position: absolute;
  z-index: 3;
}
</style>