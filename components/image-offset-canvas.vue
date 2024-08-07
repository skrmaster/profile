<script lang="ts" setup>
import cityImage from '~/assets/images/city.png';

const canvasRef = shallowRef<HTMLElement>();
const debounceFunction = debounce(ininCanvas, 500);
let elementResize: ResizeObserver | null = null;
let scrollBarWidth: number;

let list: {
  drawX: number;
  direction: number;
}[] | undefined = [];
const searchCanvas = reactive<{
  element: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null
  image: {
    width: number;
    height: number;
  }
}>({
  element: null,
  ctx: null,
  image: {
    width: 755,
    height: 250
  }
});
let img: HTMLImageElement;
function ininCanvas() {
  searchCanvas.element = document.getElementById('search') as HTMLCanvasElement;
  if (!searchCanvas.element) {
    return;
  }
  searchCanvas.ctx = searchCanvas.element?.getContext('2d');
  img = new Image();
  img.src = cityImage;
  searchCanvas.element.width = window.innerWidth - scrollBarWidth - 1;
  searchCanvas.element.height = 250;

  img.onload = () => {
    drawImageWithOffset(window.innerWidth / 2, 250 / 2);
  };
}

function drawImageWithOffset(mouseX: number, mouseY: number) {
  const canvas = searchCanvas.element;
  const ctx = searchCanvas.ctx;

  if (!canvas || !ctx) {
    return;
  }

  const offsetX = (mouseX / window.innerWidth - 0.5) * 50;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  list?.forEach((e, i) => {
    ctx.save();
    if (e.direction === 0) {
      ctx.drawImage(img, e.drawX - offsetX, 0, 755, 250);
    } else {
      ctx.translate(e.drawX, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, -755 + offsetX, 0, 755, 250);
    }
    ctx.restore();
  });
}

function generateImageList() {
  const imageWidth = 755;
  const maxWidth = searchCanvas.element?.width;
  const res = [];
  if (!maxWidth) {
    return;
  }

  const len = Math.ceil(maxWidth / imageWidth);
  for (let i = 0; i < len; i++) {
    const direction = Math.floor(Math.random() * 2);
    res.push({
      drawX: i * imageWidth - 100,
      direction
    });
  }
  return res;
}

function getScrollBarWidth(): number {
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  document.body.appendChild(div);
  const scrollBarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return scrollBarWidth;
}

function handleOffset(e: MouseEvent) {
  drawImageWithOffset(e.clientX, e.clientY);
}

onNuxtReady(() => {
  scrollBarWidth = getScrollBarWidth();
  ininCanvas();
  if (canvasRef.value) {
    list = generateImageList();
    elementResize = resize(canvasRef.value, (wh) => {
      debounceFunction();
    });
  }
});

onBeforeUnmount(() => {
  if (canvasRef.value) {
    elementResize?.unobserve(canvasRef.value);
  }
});
</script>
<template>
  <div 
      ref="canvasRef" 
      class="search__background"
    >
      <canvas 
        id="search"
        :width="searchCanvas.element?.width" 
        :height="searchCanvas.element?.height"
        @mousemove="handleOffset" 
      >
      </canvas>
    </div>
</template>
<style scoped>
.search__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
</style>