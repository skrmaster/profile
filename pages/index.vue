<script lang="ts" setup>
import roadPath from 'assets/json/road.json';

type Park = {
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  horizon: number;
}

const roadData = roadPath.data;
const roadWidth = 642;
const roadHeight = 573;
const roadGap = -55;
let roadCount = 0;
const parkCanvas: Park = {
  ctx: null,
  width: 0,
  height: 0,
  horizon: 0,
}
const bench = {
  width: 698,
  height: 313,
  smallWidth: 239,
  smallHeight: 523,
}

let img: HTMLImageElement;


function initCanvas() {
  const canvas = document.getElementById('park') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('canvas element is null!');
  }

  canvas.width = window.innerWidth;
  canvas.height = 1006;
  parkCanvas.width = canvas.width;
  parkCanvas.height = canvas.height;
  roadCount = Math.ceil((window.innerWidth + 50) / roadWidth);

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
  // ctx.scale(0.3, 0.3);
  ctx.drawImage(img, 0, 0);
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(0, parkCanvas.horizon);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.horizon - 100, parkCanvas.width, parkCanvas.horizon);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(0, parkCanvas.height - 200);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, parkCanvas.width, parkCanvas.height - 200);
  ctx.lineTo(parkCanvas.width, parkCanvas.height);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 100, 0, parkCanvas.height);
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

onNuxtReady(() => {
  img = new Image();
  img.src = '/svg/park-bench.svg';

  initCanvas();
  const resizeHandler = debounce(initCanvas, 10);
  window.addEventListener('resize', resizeHandler);
});

</script>
<template>
  <NuxtLayout 
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="false"
  >
    <com-navigation></com-navigation>
    <section class="p-r">
      <canvas id="park" class="z-index2"></canvas>
      <div class="section-bg gaussian-blur z-index3"></div>
      <div class="container z-index4">
        <div class="flex__center introduction pb10">
          <div class="fs48 text-right">
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
    </section>
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

.detail {
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
</style>
