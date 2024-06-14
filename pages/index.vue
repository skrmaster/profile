<script lang="ts" setup>
import { apiSkillGetList } from '~/api/skill/request';

import roadPath from 'assets/json/road.json';
import benchPath from 'assets/json/bench.json';
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

useHead({
  title: "首页"
});

const benchData = benchPath.data;
const roadData = roadPath.data;
const walkData = walking.data;

const { $message } = useNuxtApp();
const themeState = useState('theme');
const theme = computed(() => themeState.value);

watch(theme, (val) => {
  if (val) {
    changeLight(val as string);
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

const light = {
  width: 183,
  height: 845,
  smallWidth: 92,
  smallHeight: 408,
}

const grass = {
  count: 0,
  width: 564,
  height: 564,
  gap: 110,
}

const man = {
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


const skillsName = ref<Skill.SkillName[]>([]);
const skills = ref<Array<Skill.Skill>>([]);
function fetchSkillsData() {
  const params: Omit<Pagination, 'total'> = {
    page: 1,
    pageSize: 15
  }

  apiSkillGetList(params).then(res => {
    skillsName.value = res.data.list.map(e => {
      return {
        name: e.name,
        proficiency: e.proficiency,
        id: e.id
      }
    });
  }).catch(() => {
    skillsName.value = [];
  });
}

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

function initCanvas() {
  windowWidth.value = window.innerWidth;
  man.width = 110;
  man.height = 200;
  man.stepX = 110;

  clearAnimate();

  const canvas = document.getElementById('park') as HTMLCanvasElement;
  if (!canvas) {
    return;
  }

  if (window.innerWidth <= 992) {
    let reallyWidth = window.innerWidth;
    let w = 992;
    parkScale.value = reallyWidth / w;

    canvas.width = w - scrollBarWidth - 1;
    canvas.height = 1006;
  } else {
    parkScale.value = 1;
    canvas.width = window.innerWidth - scrollBarWidth - 1;
    canvas.height = 1006;
  }
  
  parkCanvas.width = canvas.width;
  parkCanvas.height = canvas.height;
  road.count = Math.ceil((window.innerWidth + 50) / road.width);
  grass.count = Math.ceil(window.innerWidth / grass.width);
  man.walkWidth = window.innerWidth;
  man.stepY = parkCanvas.height + 100;
  man.stepYDiff = (parkCanvas.height - man.height - 150 * 2) - man.stepY;
  man.countY = man.walkWidth / 2 / man.stepX;
  man.y = (parkCanvas.height - man.height - 320) + (man.stepYDiff / man.countY);

  parkCanvas.ctx = canvas.getContext('2d');
  parkCanvas.horizon = canvas.height / 2;

  requestTimer.animateTimerTop = window.requestAnimationFrame(draw);
}

function draw() {
  let ctx: CanvasRenderingContext2D ;
  if (parkCanvas.ctx) {
    ctx = parkCanvas.ctx
  } else {
    draw();
    return;
  }

  //循环动画第一帧
  if (man.stepX * (man.timeControl / 100 - 2) > man.walkWidth + man.stepX * 3) {
    man.timeControl = 0;
    drawIndex = 0;
    man.sitingTime = 100;
    man.walkToSitingWaitTime = 10;
    man.sitingToWalkToWaitTime = 10;
    timer.lastFrameTimer = setTimeout(() => {
      requestTimer.animateTimerTop6 = window.requestAnimationFrame(draw);
    }, 5000);
    return;
  }

  //动画
  if (man.timeControl % 10 === 0) {
    if (isNull(parkCanvas.ctx)) {
      return; 
    }
    ctx.clearRect(0, 0, 5000, 5000);
    ctx.drawImage(img, parkCanvas.width / 2 - bench.smallWidth / 2, 
      parkCanvas.height / 2 - bench.smallHeight / 10, 
      bench.smallWidth, bench.smallHeight);
    
    ctx.drawImage(lightImg, parkCanvas.width / 2 + 3 * light.smallWidth, 
      parkCanvas.height / 2 - light.smallHeight / 1.5, 
      light.smallWidth, light.smallHeight);
    
    //从屏幕外进入
    if (man.stepX * (man.timeControl / 50 - 2) >= man.walkWidth / 2 - man.stepX && man.sitingTime > 0) {
      if (man.sitingToWalkToWaitTime > 0 && man.sitingTime === 1) {
        //离开凳子
        man.y -= ((man.sitingToWalkToWaitTime - 10) * 2);
        drawWalking(
          ctx, 
          0, 
          man.y, 
          (man.stepX) * (man.timeControl / 50 - 2)
        );
        drawLight(ctx);
        drawRoad(ctx);
        requestTimer.animateTimerTop2 = window.requestAnimationFrame(draw);
        man.sitingToWalkToWaitTime--;
        return
      } else {
        if (man.sitingTime > 1) {
          drawSitingMan(ctx, parkCanvas.width / 2 - bench.smallWidth / 2 + 180, (parkCanvas.height - man.height - 180 * 2));
        } else {
          drawWalking(
          ctx, 
          0, 
          man.y, 
          (man.stepX) * (man.timeControl / 50 - 2)
        );
        }
        drawLight(ctx);
        drawRoad(ctx);
        man.sitingTime--;
        requestTimer.animateTimerTop3 = window.requestAnimationFrame(draw);
        return;
      }
    } else {
      if (man.stepX * (man.timeControl / 50 - 2) >= man.walkWidth / 2 - man.stepX * 2 && man.walkToSitingWaitTime > 0) {
        //移向凳子
        man.y += ((man.walkToSitingWaitTime - 10) * 2);
        drawWalking(
          ctx, 
          0, 
          man.y, 
          (man.stepX) * (man.timeControl / 50 - 2)
        );
        drawLight(ctx);
        drawRoad(ctx);
        requestTimer.animateTimerTop4 = window.requestAnimationFrame(draw);
        man.walkToSitingWaitTime--;
        return
      } else {
        drawWalking(
          ctx, 
          0, 
          man.y, 
          (man.stepX) * (man.timeControl / 50 - 2)
        );
      }
    }
  } 
  else {
    requestTimer.animateTimerTop5 = window.requestAnimationFrame(draw);
    man.timeControl++;
    return;
  }
  
  man.timeControl++;

  drawLight(ctx);
  drawRoad(ctx);
  requestTimer.animateTimerTop1 = window.requestAnimationFrame(draw);
}

let drawIndex = 0;
function drawWalking(ctx: CanvasRenderingContext2D, x: number, y: number, offset = 0) {
  if (drawIndex > 8) {
    drawIndex = 0;
  }
  ctx.save();
  ctx.translate(x + offset, y);
  const path = new Path2D(walkData[1][drawIndex]);
  const p = new Path2D();
  p.addPath(path);
  ctx.fillStyle = '#0a0b0b';
  ctx.fill(p);
  ctx.restore();
  drawIndex++
}

function drawSitingMan(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(2, 2);
  const path = new Path2D(walkData[0] as string);
  const p = new Path2D();
  p.addPath(path);
  ctx.fillStyle = '#0a0b0b';
  ctx.fill(p);
  ctx.restore();
}

function drawLight(ctx: CanvasRenderingContext2D) {
  if (theme.value === 'light') {
    clearYellowLight(ctx, parkCanvas.width / 2 + 3.5 * light.smallWidth, 
    parkCanvas.height / 2 - light.smallHeight / 1.5 + 90, 800);
    return;
  }
  //灯光
  simulateYellowLight(ctx, parkCanvas.width / 2 + 3.5 * light.smallWidth, 
    parkCanvas.height / 2 - light.smallHeight / 1.5 + 90, 800)
}
//#region 路
function drawRoad(ctx: CanvasRenderingContext2D) {
  ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, parkCanvas.horizon);
    ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.horizon - 100, 
      parkCanvas.width, parkCanvas.horizon);
    ctx.moveTo(parkCanvas.width, parkCanvas.height - 200);
    ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, 
      0, parkCanvas.height - 200);
    ctx.stroke();
    ctx.closePath();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(0, parkCanvas.height - 200);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, 
    parkCanvas.width, parkCanvas.height - 200);
  ctx.lineTo(parkCanvas.width, parkCanvas.height);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 100, 
    0, parkCanvas.height);
  ctx.lineTo(0, parkCanvas.height - 200);
  ctx.stroke();
  ctx.closePath();

  ctx.save();
    ctx.clip();
    ctx.translate(road.gap - 50, road.height + 150);
    for (let i = 0; i <= road.height; i++) {
      if (i % 2 === 1) {
        generateRoad(ctx, () => {
          ctx.translate((i + 1) * road.width - road.gap, road.height / 2);
          ctx.rotate(180 * Math.PI / 180);
          ctx.transform(1, 0, 0, 0.5, 0, 0);
        });
      } else {
        generateRoad(ctx, () => {
          ctx.translate(i * road.width, 0);
          ctx.transform(1, 0, 0, 0.5, 0, 0);
        });
      }
    }
  ctx.restore();
}
//#endregion

const styleMap: Record<string, 'lineWidth' | 'strokeStyle' | 'miterLimit' | 'lineCap' | 'lineJoin' | 'fillStyle'> = {
  'stroke-width': 'lineWidth',
  'stroke': 'strokeStyle',
  'stroke-miterlimit': 'miterLimit',
  'stroke-linecap': 'lineCap',
  'stroke-linejoin': 'lineJoin',
  'fill': 'fillStyle',
}

function simulateYellowLight(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  let gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
  gradient.addColorStop(0.15, 'rgba(255, 255, 0, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function clearYellowLight(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  let gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');
  gradient.addColorStop(0.15, 'rgba(255, 255, 0, 0)');
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function generateRoad(ctx: CanvasRenderingContext2D, cb: () => void) {
  ctx.save();
  cb();
  const tmp: Record<string, Path2D> = {};
  roadData.forEach((e: string, i: number) => {
    tmp[`p${i}`] = new Path2D(e);
  });

  const p = new Path2D();
  for (const key in tmp) {
    p.addPath(tmp[key]);
  }
  ctx.stroke(p);
  ctx.restore();
}

function changeLight(val: string) {
  if (lightImg && lightImg.src) {
    lightImg.src = val === 'light' ? ligthOffSvg : ligthOnSvg;
  }
}

function loadResource() {
  img = new Image();
  img.src = benchSvg;

  man.width = 110;
  man.height = 200;
  man.stepX = 110;

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
  fetchSkillsData();
  scrollBarWidth = getScrollBarWidth();
  loadResource();
  const resizeHandler = debounce(initCanvas, 500);
  window.addEventListener('resize', resizeHandler);
});

onBeforeUnmount(() => {
  clearAnimate();
});

</script>
<template>
  <NuxtLayout name="header-section-footer">
    <section class="p-r">
      <canvas 
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
            <div>
              <p class="fs18">介绍</p>
              <p class="detail fs24 my2">
                专注于使用<span class="font-bold">Vuejs</span>进行中后台系统
                开发、组件二次封装、<span class="font-bold">SSR</span>网站
                前端开发等等...
              </p>
              <com-button suffix-icon="profile-arrow" link><NuxtLink class="fs18" to="#skills" style="color: var(--primary-color);">了解更多</NuxtLink></com-button>
            </div>
          </div>
        </div>
        <div v-if="windowWidth > 578 && windowWidth < 992" class="introducion-seat"></div>
      </div>
    </section>
    <index-skills :skill-name="skillsName" v-show="windowWidth >= 992" :width="windowWidth"></index-skills>
    <index-skills-small :skills="skillsName" v-show="windowWidth < 992"></index-skills-small>
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
        <com-form ref="formRef" class="index__form mx-auto mb4" :model="formConfig">
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
</style>