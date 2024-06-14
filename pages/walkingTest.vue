<script lang="ts" setup>
import walking from 'assets/json/walkMan.json';

const walkData = walking.data;


const man: any = {
  x: 0,
  y: 0,
  offsetX: 100,
  ctx: null,
  time: 0
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

function draw() {
  let ctx: CanvasRenderingContext2D ;
  if (man.ctx) {
    ctx = man.ctx
  } else {
    draw();
    return;
  }

  if ((man.time / 40) * man.offsetX > window.innerWidth) {
    man.time = 0;
    window.requestAnimationFrame(draw);
    return;
  }

  if (man.time % 20 === 0) {
    ctx.clearRect(0, 0, 5000, 5000);
    drawWalking(ctx, 0, 0, (man.time / 40) * man.offsetX);
  } else {
    man.time++;
    window.requestAnimationFrame(draw);
    return;
  }

  man.time++;
  window.requestAnimationFrame(draw);
}

onNuxtReady(() => {
  const canvas = document.getElementById('park') as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  man.ctx = canvas.getContext('2d');
  const scrollBarWidth = getScrollBarWidth();
  canvas.width = window.innerWidth;
  canvas.height = 1006;
  draw();
});
</script>
<template>
  <div>
    <canvas id="park" class="z-index2"></canvas>
  </div>
</template>
<style scoped>

</style>