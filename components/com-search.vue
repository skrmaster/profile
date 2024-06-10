<script lang="ts" setup>
import cityImage from '~/assets/images/city.png';

type Prop = {
  modelValue?: string;
  needBg?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: '',
  needBg: true
});
const emit = defineEmits<{
  'update:modelValue': [val: string],
  'search': []
}>();

const canvasRef = shallowRef<HTMLElement>();
const debounceFunction = debounce(ininCanvas, 500);
let elementResize: ResizeObserver | null = null;
let scrollBarWidth: number;

const search = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  }
});

function handleLayout(e: UIEvent, wh?: Resize[]) {
  console.log(e);
  
  if (searchCanvas.element) {
    const item = wh ? wh[0] : null;
    
    searchCanvas.element.width =  item?.w ?? (window.innerWidth - scrollBarWidth);
    searchCanvas.element.height = 250;
    console.log(searchCanvas.element.width);
    
  }
}

function handleSearch() {
  emit('search');
}

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
  searchCanvas.element.width = window.innerWidth - scrollBarWidth;
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
  <div class="search p-r px1">
    <div class="w100 flex__center search__box">
      <com-form-input
        class="search__input"
        type="search"
        v-model="search"
        :is-label="false"
        :width="1000"
        clearable
        @keydown.enter="handleSearch"
      >
        <template #prepend>
          <com-icon 
            width="45px"
            height="45px"
            class="ml2 search__icon" 
            icon="profile-search"
          > </com-icon>
        </template>
        <template #append>
          <com-button @click.stop="handleSearch" class="search__btn mr2" plain is-ripple>
            <span class="fs20" style="pointer-events: none">搜索</span>
          </com-button>
        </template>
      </com-form-input>
    </div>
    <div 
      ref="canvasRef" 
      v-if="props.needBg" 
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
  </div>
</template>
<style scoped>
.search {
  height: 250px;
  background: var(--white-color);
  border-bottom: 1px solid var(--primary-border-color);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

:deep(input.form__input-field) {
  background: var(--white-color);
  color: var(--primary-color);
}

.search__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.search__box {
  position: absolute;
  bottom: 0;
  transform: translateY(50%);
  z-index: 2;
}

.search__icon {
  width: 45px;
  height: 45px;
}

.search__btn {
  width: 100px;
  height: 50px;
}

:deep(.search__input.form__input-box) {
  height: 90px;
  border-width: 3px;
  border-radius: 55px;
}

:deep(.search__input .form__input-field) {
  height: 100%;
  border-radius: 55px;
}
</style>