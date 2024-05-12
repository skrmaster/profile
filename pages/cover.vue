<script lang="ts" setup>
let dom_canvas: HTMLCanvasElement;
let toolGetPos: ICanvasUtil;
const ball = {
  x: 0,
  y: 0,
  vx: 5,
  vy: 2,
}
const line = {
  x: 0,
  y: 1000,
  vx: 5,
  vy: 2,
}

onNuxtReady(() => {
  initCanvas()

  const resizeHandler = debounce(initCanvas);
  window.addEventListener('resize', resizeHandler);
})


function initCanvas() {
  dom_canvas = document.getElementById('cover') as HTMLCanvasElement;
  const canvas = document.getElementById('cover') as HTMLCanvasElement;

  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    line.x = Math.ceil(window.innerWidth / 2)
  }

  toolGetPos = new CanvasUtils(window.innerWidth, window.innerHeight)
  let { x, y } = toolGetPos.getCanvasCenterPointPosition()
  ball.x = x
  ball.y = y
  ball.vx = 5
  ball.vy = 2

  line.y = 1000
  line.vx = 5
  line.vy = 2

  window.requestAnimationFrame(draw)
}

function draw() {
  if (!dom_canvas) {
    return
  }
  const ctx = dom_canvas.getContext("2d")
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  ctx.strokeStyle = "#3c4d53"
  ctx.lineWidth = 8
  ctx.lineCap = "round"

  ctx.beginPath()
  ctx.arc(ball.x, ball.y, 112, 0, 2 * Math.PI, false)
  ctx.fillStyle = "#d8e3e7"
  ctx.closePath()
  ctx.fill()

  ball.y += ball.vy;
  ball.vy *= 0.99;
  ball.vy += 0.25;

  ctx.moveTo(5, 1000)
  ctx.quadraticCurveTo(line.x, line.y, window.innerWidth - 5, 1000)

  ctx.stroke()

  if (ball.y + ball.vy >= 1000 - 105) {
    line.y += ball.vy * 2;
    line.vy *= 0.99;
    line.vy += 0.25;
  }

  if (ball.y + ball.vy >= window.innerHeight - 105) {
    return
  }

  window.requestAnimationFrame(draw)
}

</script>

<template>
  <div class="animate__container">
    <canvas id="cover"></canvas>
  </div>
</template>

<style scoped>
.animate__container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, #e2e2e2 0%, #d9e3e7 100%);
}
</style>