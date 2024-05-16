<script lang="ts" setup>
import roadPath from 'assets/json/road.json';
import benchPath from 'assets/json/bench.json'

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
const roadWidth = 642;
const roadHeight = 573;
const roadGap = -55;
let roadCount = 0;
const formConfig: Array<FormConfig> = [
  {
    require: true,
    field: 'name',
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
    field: 'contactWay',
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

let scrollBarWidth: number;
let img: HTMLImageElement;
let lightImg: HTMLImageElement;
let grassImg: HTMLImageElement;

function featherImage(
  ctx: CanvasRenderingContext2D, 
  img: HTMLImageElement, 
  x: number, 
  y: number, 
  width: number, 
  height: number
) {
  ctx.drawImage(img, x, y, width, height);
  const gradient = ctx.createRadialGradient(
    x + width / 2, 
    y + height / 2
    , 
    0, 
    x + width / 2, y + height / 2, 
    Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2);

  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
}


function initCanvas() {
  const canvas = document.getElementById('park') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('canvas element is null!');
  }

  canvas.width = window.innerWidth - scrollBarWidth - 1;
  canvas.height = 1006;
  parkCanvas.width = canvas.width;
  parkCanvas.height = canvas.height;
  roadCount = Math.ceil((window.innerWidth + 50) / roadWidth);
  grass.count = Math.ceil(window.innerWidth / grass.width);

  parkCanvas.ctx = canvas.getContext('2d');
  parkCanvas.horizon = canvas.height / 2;
  
  if (!parkCanvas.ctx) {
    throw new Error('canvas context is null!');
  }

  window.requestAnimationFrame(draw);
}

function draw(): void {
  let ctx: CanvasRenderingContext2D ;
  if (parkCanvas.ctx) {
    ctx = parkCanvas.ctx
  } else {
    return;
  }

  ctx.save();
  const x = parkCanvas.width / 2 - bench.width / 2 ;
  const y = parkCanvas.height / 2 - bench.height / 2;
  ctx.translate(x, y);
  ctx.scale(0.8, 0.8);
  drawBench(ctx, benchData);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, parkCanvas.horizon);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.horizon - 100, 
    parkCanvas.width, parkCanvas.horizon);
  ctx.lineTo(parkCanvas.width, parkCanvas.height - 200);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, 
    0, parkCanvas.height - 200);
  ctx.lineTo(0, parkCanvas.horizon);
  ctx.stroke();
  ctx.clip();
  ctx.closePath();
  for (let i = 0; i <= grass.count; i++) {
    // featherImage(ctx, grassImg, i * grass.width, 400, grass.width, grass.height);
    // ctx.drawImage(
    //   grassImg, 
    //   0,
    //   0,
    //   grass.width - grass.gap - 50,
    //   grass.height,
    //   i * grass.width,
    //   400,
    //   grass.width,
    //   grass.height
    // );
  }

  ctx.restore();

  ctx.drawImage(img, parkCanvas.width / 2 - bench.smallWidth / 2, 
    parkCanvas.height / 2 - bench.smallHeight / 10, 
    bench.smallWidth, bench.smallHeight);
  
  ctx.drawImage(lightImg, parkCanvas.width / 2 + 3 * light.smallWidth, 
    parkCanvas.height / 2 - light.smallHeight / 1.5, 
    light.smallWidth, light.smallHeight);
 

  ctx.beginPath();
  ctx.moveTo(0, parkCanvas.height - 200);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, 
    parkCanvas.width, parkCanvas.height - 200);
  ctx.lineTo(parkCanvas.width, parkCanvas.height);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 100, 
    0, parkCanvas.height);
  ctx.stroke();
  ctx.clip();
  ctx.closePath();

  ctx.save();
  ctx.translate(roadGap - 50, roadHeight + 150);
  for (let i = 0; i <= roadCount; i++) {
    if (i % 2 === 1) {
      generateRoad(ctx, () => {
        ctx.translate((i + 1) * roadWidth - roadGap, roadHeight / 2);
        ctx.rotate(180 * Math.PI / 180);
        ctx.transform(1, 0, 0, 0.5, 0, 0);
      });
    } else {
      generateRoad(ctx, () => {
        ctx.translate(i * roadWidth, 0);
        ctx.transform(1, 0, 0, 0.5, 0, 0);
      });
    }
  }
  ctx.restore();
}

const styleMap: Record<string, 'lineWidth' | 'strokeStyle' | 'miterLimit' | 'lineCap' | 'lineJoin' | 'fillStyle'> = {
  'stroke-width': 'lineWidth',
  'stroke': 'strokeStyle',
  'stroke-miterlimit': 'miterLimit',
  'stroke-linecap': 'lineCap',
  'stroke-linejoin': 'lineJoin',
  'fill': 'fillStyle',
}

function drawBench(ctx: CanvasRenderingContext2D, arr: typeof benchData) {
  const p = new Path2D();
  for (let i = 0; i < arr.length; i++) {
    arr[i].forEach(e => {
      if (e[1] === 'path') {
        ctx.save();
        ctx.beginPath();
        if (Array.isArray(e[0])) {
          e[0].forEach(item => {
            const res = item.split(':');
            (ctx as any)[styleMap[res[0]]] = res[1].replace('px', '');
          });
        }
        const p1 = new Path2D(e[2] as string);
        p.addPath(p1);
        ctx.fill(p);
        ctx.restore();
      } else if (e[1] === 'polygon') {
        ctx.save();
        if (Array.isArray(e[0])) {
          e[0].forEach(item => {
            const res = item.split(':');
            (ctx as any)[styleMap[res[0]]] = res[1].replace('px', '');
          });
        }
        const polygonPoint = (e[2] as string).split(' ');
        drawPolygon(ctx, polygonPoint.map(e => parseFloat(e) * 1));
        ctx.restore();
      } else if (e[1] === 'rect') {
        ctx.save();
        if (Array.isArray(e[0])) {
          e[0].forEach(item => {
            const res = item.split(':');
            (ctx as any)[styleMap[res[0]]] = res[1].replace('px', '');
          });
        }
        if (Array.isArray(e[2])) {
          let x = parseFloat(e[2][0]);
          let y = parseFloat(e[2][1]);
          let w = parseFloat(e[2][2]);
          let h = parseFloat(e[2][3]);
          ctx.fillRect(x, y, w, h);
        }
        ctx.restore();
      }
    });
  }
}

function drawPolygon(ctx: CanvasRenderingContext2D, arr: number[]) {
  const len = arr.length;
  
  for (let i = 0; i < len; i++) {
    if (i % 2 !== 0) {
      continue
    } else {
      if (i === 0) {
        ctx.moveTo(arr[i], arr[i + 1]);
      } else {
        ctx.lineTo(arr[i], arr[i + 1]);
      }
    }
  }
  ctx.stroke();
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

function getScrollBarWidth(): number {
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollbarWidth;
}

onNuxtReady(() => {
  scrollBarWidth = getScrollBarWidth();
  
  img = new Image();
  // img.src = '/svg/park-bench.svg';
  lightImg = new Image();
  lightImg.src = '/svg/light-on.svg';
  grassImg = new Image();
  grassImg.src = '/images/grass2.jpg';

  initCanvas();
  const resizeHandler = debounce(initCanvas, 500);
  window.addEventListener('resize', resizeHandler);
});

const tableHeadConfig: TableHead[] = [
  {
    name: "名称",
    field: "name",
    width: "",
    class: "",    
    align: "",
  },
  {
    name: "数量",
    field: "count",
    width: "",
    class: "",
    align: "",
  },
  {
    name: "类型",
    field: "category",
    width: "",
    class: "",
    align: "",
  },
  {
    name: "创建日期",
    field: "createTime",
    width: "",
    class: "",
    align: "",
  },
  {
    name: "操作",
    field: "",
    width: "",
    class: "",
    align: "",
    operate: ['edit', 'delete']
  }
];

const tableBody = [
  {
    name: "测试",
    count: 1,
    category: "单色",
    createTime: "2044-02-12",
  },
  {
    name: "测试2",
    count: 1,
    category: "单色",
    createTime: "2044-02-12",
  }
];

</script>
<template>
  <NuxtLayout 
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="false"
  >
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <com-table :head="tableHeadConfig" :data="tableBody"></com-table>
    <section class="p-r">
      <canvas id="park" class="z-index2"></canvas>
      <div class="section-bg gaussian-blur z-index3"></div>
      <div class="container z-index4">
        <div class="introduction">
          <div class="flex__center flex-wrap introduciton-text-height">
            <div class="fs48 text-right self-introduction">
              <p>嗨,</p>
              <p class="my1">我是<span class="font-bold fs60">郑洋</span></p>
              <p class="fs24">前端开发工程师</p>
            </div>
            <div class="section__avatar">
              <div class="avatar__box mx-auto">
                <img src="" alt="avatar" />
              </div>
            </div>
            <div>
              <p class="fs18">介绍</p>
              <p class="detail fs24 my2">
                专注于使用<span class="font-bold">Vuejs</span>进行中后台系统
                开发、组件二次封装、<span class="font-bold">SSR</span>网站
                前端开发等等...
              </p>
              <com-button suffix-icon="profilearrow" link><span class="fs18">了解更多</span></com-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <index-skills></index-skills>
    <index-projects></index-projects>
    <div class="container">
      <div class="text-center">
        <p class="fs48">联系我</p>
        <p class="fs18 text-uppercase">contact me</p>
      </div>
      <div class="contact my5">
        <div class="contact__item flex__column--center">
          <com-icon width="60px" height="60px" icon="profilephone"></com-icon>
          <p class="contact__item-gap fs24">电话</p>
          <p class="fs30">+8618283170317</p>
        </div>
        <div class="contact__item flex__column--center contact__borderx">
          <com-icon width="60px" height="60px" icon="profilewechat"></com-icon>
          <p class="contact__item-gap fs24">微信</p>
          <p class="fs30">skrMogul</p>
        </div>
        <div class="contact__item flex__column--center">
          <com-icon width="60px" height="60px" icon="profileemail"></com-icon>
          <p class="contact__item-gap fs24">邮箱</p>
          <p class="fs30">18283170317zy@gmail.com</p>
        </div>
      </div>
      <com-form class="index__form mx-auto mb4" :model="formConfig">
        <com-button class="submit-btn mt1 fs24">提交</com-button>
      </com-form>
    </div>
    <com-footer></com-footer>
    <div style="height: 120px;" class="display-5-none display-4-none display-3-none"></div>
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
}

.introduciton-text-height {
  height: 550px;
}

.section__avatar {
  max-width: 503px;
  width: 100%;
}

.avatar__box {
  width: 363px;
  height: 363px;
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

.contact {
  display: flex;
  flex-flow: row wrap;
}

.contact__item {
  flex: 1;
  max-width: 500px;
  width: 100%;
  height: 338px;
  min-width: 390px;
  margin: 0 auto;
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
  background: #eeeeee;
}

:deep(.index__form .form__input-box .form__placeholder--active) {
  background: #eeeeee;
}

:deep(.index__form .form__input-box input) {
  background: #eeeeee;
}

.submit-btn {
  width: 250px;
  height: 92px;
}
</style>
