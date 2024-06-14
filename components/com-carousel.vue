<script lang="ts" setup>
type Prop = {
  isLoop?: boolean;
  list?: Carousel.ImageList[]
}

const props = withDefaults(defineProps<Prop>(), {
  isLoop: false,
  list: () => []
});

const boxRef = ref();
const carouselRef = ref();
const boxOutRef = ref();

const { $message } = useNuxtApp();
let currentVal = 2;
const transitionTime = 0.3;
const currentIndex = ref(props.isLoop ? currentVal : 1);
const carousel = reactive({
  boxWidth: 1395,
  transformWidth: 348 + 22,
  width: 348,
  height: 192,
  gap: 22,
  rowCount: 3,
  activeWidth: 629,
  activeHeight: 342,
});
let elementResize: ResizeObserver | null = null;

const translate = ref(props.isLoop ? carousel.transformWidth : 0);
const itemTime = ref(transitionTime);
const carouselList = computed(() => {
  return props.list.map(e => {
    return {
      ...e,
      class: 'carousel__item'
    }
  });
});
const carouselSwitch = ref(false);
const offset = ref(0);
const rowCount = computed(() => {
  return carousel.rowCount;
});

const previewList = ref<string[]>([]);
const previewRef = ref();

const renderCarouselList = computed(() => {
  if (props.isLoop) {
    return carouselList.value
      .slice(-1)
      .concat(carouselList.value.concat(carouselList.value));
  } else {
    return carouselList.value;
  }
});

const carouselStyleList = computed(() => {
  return {
    transform: `translate(${translate.value >= 0 
      ? '-' + translate.value 
      : Math.abs(translate.value)
    }px, 0)`,
  }
});

function openPreview(item: Carousel.ImageList) {
  let url: string | undefined;
  url = item.image;

  if (!url) {
    $message.show({
      message: '无法预览无法加载的图片',
      type: 'error'
    });
    return;
  }
  previewList.value = [url]
  previewRef.value.open();
}

function blobToUrl(item: File): string | undefined {
  let res: string;
  try {
    res = URL.createObjectURL(item);
    return res;
  } catch {
    return;
  }
}

function handleLoop(index: number) {
  if (index === 1) {
    setTimeout(() => {
      boxRef.value.style.transitionDuration = '0s';
      itemTime.value = 0;
      currentIndex.value = carouselList.value.length + 1;
      translate.value = carouselList.value.length * carousel.transformWidth;
        
      setTimeout(() => {
        itemTime.value = transitionTime;
        boxRef.value.style.transitionDuration = `${transitionTime}s`;
        carouselSwitch.value = false;
      }, 1);
    }, transitionTime * 1000 + 1);
  } else if (index === renderCarouselList.value.length - 2) {
    setTimeout(() => {
      boxRef.value.style.transitionDuration = '0s';
      itemTime.value = 0;
      currentIndex.value = currentVal;
      translate.value = carousel.transformWidth;
        
      setTimeout(() => {
        itemTime.value = transitionTime;
        boxRef.value.style.transitionDuration = `${transitionTime}s`;
        carouselSwitch.value = false;
      }, 1);
    }, transitionTime * 1000 + 1);
  } else {
    carouselSwitch.value = false;
  }
}

function iconNext(index: number) {
  const isFirst = index === -1;
  const isLast = index === carouselList.value.length;

  if (isFirst || isLast) {
    if (isFirst) {
      $message.show({
        message: '已经是第一张了',
        type: 'info'
      });
    } else {
      $message.show({
        message: '已经是最后一张了',
        type: 'info'
      });
    }

    return
  }
  next(index);
}

function next(index: number) {
  if (carouselSwitch.value) {
    return
  }

  carouselSwitch.value = true;

  if (currentIndex.value === index) {
    openPreview(carouselList.value[index]);
    carouselSwitch.value = false;
    return
  }

  if (index > currentIndex.value) {
    currentIndex.value = index;
    translate.value += carousel.transformWidth;
    
  } else {    
    currentIndex.value = index;
    translate.value -= carousel.transformWidth;
  }

  if (!props.isLoop) {
    carouselSwitch.value = false;
    return
  }

  setTimeout(() => {
    handleLoop(index);
  }, transitionTime * 1000);
}

onMounted(() => {
  elementResize = resize(carouselRef.value , (arg: Resize) => {
    const numArr = stringRegexp(boxRef.value?.style.transform, 'number');
    
    if (carousel.boxWidth > arg.w) {
      offset.value = carousel.boxWidth - arg.w;
    } else {
      offset.value = 0;
    }

    if (numArr) {
      let x = offset.value;

      if (boxOutRef.value) {
        boxOutRef.value.style.transform = `translateX(-${x / 2}px)`;
      }
    }

    if (carousel.activeWidth + (carousel.width * 2) / 2 >= arg.w) {
      carousel.rowCount = 1;
    } else {
      carousel.rowCount = 3;
    }
  });
});

onBeforeUnmount(() => {
  elementResize?.unobserve(boxRef.value);
})
</script>
<template>
  <div 
    ref="carouselRef"
    class="carousel" 
    :style="{
      '--box-duration-time': `${transitionTime}s`,
      '--item-duration-time': `${itemTime}s`
    }"
  >
    <div ref="boxOutRef">
      <div 
        ref="boxRef" 
        class="carousel__box" 
        :style="carouselStyleList"
      >
        <div 
          v-for="(item, index) in renderCarouselList" 
          :key="index"
          :id="item.id" 
          class="carousel__item c-p"
          :class="{
            active: index === currentIndex
          }"
          @click="next(index)"
        >
          <img :src="item.image" />
        </div>
      </div>
    </div>
    <div 
      v-if="rowCount === 1" 
      class="prev flex__center"
      @click="iconNext(currentIndex - 1)"
    >
      <com-icon 
        class="flex__center"
        color="var(--white-color)" 
        icon="profile-left"
        width="20px"
        height="20px"
      ></com-icon>
    </div>
    <div 
      v-if="rowCount === 1" 
      class="next flex__center"
      @click="iconNext(currentIndex + 1)"
    >
      <com-icon 
        color="var(--white-color)" 
        class="icon__right flex__center" 
        icon="profile-left"
        width="20px"
        height="20px"
      ></com-icon>
    </div>
    <com-preview-image 
      ref="previewRef" 
      :image-urls="previewList"
    ></com-preview-image>
  </div>
</template>
<style scoped>
.carousel {
  margin-left: auto;
  margin-right: auto;
  max-width: 1395px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.carousel__box {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  transition: all var(--box-duration-time) cubic-bezier(0.55, 0, 0.1, 1);
  position: relative;
  min-height: 342px;
}

.carousel__item {
  flex-shrink: 0;
  flex-grow: 0;
  transition: all var(--item-duration-time) cubic-bezier(0.55, 0, 0.1, 1);
  width: 348px;
  height: 192px;
  margin: 0 11px;
  overflow: hidden;
  user-select: none;
  text-align: center;
}

.carousel__item.active {
  width: 629px;
  height: 342px;
}

.carousel__item img {
  max-width: 100%;
  max-height: 100%;
}

.prev {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translate(0, -50%);
  background: var(--model-bg-color);
  border-radius: 50%;
}

.next {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translate(0, -50%);
  background: var(--model-bg-color);
  border-radius: 50%;
}

.icon__right {
  transform: rotate(180deg);
}
</style>