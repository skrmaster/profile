<script lang="ts" setup>
type Prop = {
  isLoop?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  isLoop: false,
});

const boxRef = ref();
const carouselRef = ref();
const boxOutRef = ref();

let currentVal = 2;
const transitionTime = 0.3;
const currentIndex = ref(currentVal);
const carousel = reactive({
  boxWidth: 1395,
  width: 348 + 22,
  height: 192,
  gap: 22,
  rowCount: 3,
});

const translate = ref(carousel.width);
const itemTime = ref(transitionTime);
const carouselList = ref([
  {
    id: '1',
    image: '/images/pd3.png',
    class: 'carousel__item',
  },
  {
    id: '2',
    image: '/images/pd3.png',
    class: 'carousel__item',
  },
  {
    id: '3',
    image: '/images/pd3.png',
    class: 'carousel__item',
  }
]);
const carouselSwitch = ref(false);
const offset = ref(0);

const renderCarouselList = computed(() => {
  return carouselList.value
    .slice(-1)
    .concat(carouselList.value.concat(carouselList.value));
});

const carouselStyleList = computed(() => {
  return {
    transform: `translate(-${translate.value}px, 0)`,
  }
});

function openPreview() {

}

function handleLoop(index: number) {
  if (index === 1) {
    setTimeout(() => {
      boxRef.value.style.transitionDuration = '0s';
      itemTime.value = 0;
      currentIndex.value = carouselList.value.length + 1;
      translate.value = carouselList.value.length * carousel.width;
        
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
      translate.value = carousel.width;
        
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

function next(index: number) {
  if (carouselSwitch.value) {
    return;
  }

  carouselSwitch.value = true;

  if (currentIndex.value === index) {
    openPreview();
    return
  }

  if (index > currentIndex.value) {
    currentIndex.value = index;
    translate.value += carousel.width;
  } else {
    currentIndex.value = index;
    translate.value -= carousel.width;
  }

  if (!props.isLoop) {
    return
  }

  setTimeout(() => {
    handleLoop(index);
  }, transitionTime * 1000);
}

onNuxtReady(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      
      const numArr = stringRegexp(boxRef.value.style.transform, 'number');
      
      console.log(entry, entry.borderBoxSize[0].inlineSize);
      
      if (carousel.boxWidth > entry.borderBoxSize[0].inlineSize) {
        offset.value = carousel.boxWidth - entry.borderBoxSize[0].inlineSize;
      } else {
        offset.value = 0;
        return
      }

      if (numArr) {
        let x = offset.value;
        
        if (boxOutRef.value) {
          boxOutRef.value.style.transform = `translateX(-${Math.abs(x)}px)`
        }
      }
    }
  });
  resizeObserver.observe(carouselRef.value);
});
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
    <div ref="boxOutRef" style="">
      <div 
        ref="boxRef" 
        class="carousel__box" 
        :style="carouselStyleList"
      >
        <div 
          v-for="(item, index) in renderCarouselList" 
          :key="index"
          :id="item.id" 
          class="carousel__item"
          :class="{
            active: index === currentIndex
          }"
          @click="next(index)"
        >
          <img :src="item.image" />
        </div>
      </div>
    </div>
    <div class="prev">
      <com-icon></com-icon>
    </div>
    <div class="next">
      <com-icon></com-icon>
    </div>
  </div>
</template>
<style scoped>
.carousel {
  margin-left: auto;
  margin-right: auto;
  max-width: 1395px;
  width: 100%;
  border: 1px solid var(--primary-border-color);
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
  transition: all var(--item-duration-time) cubic-bezier(0.55, 0, 0.1, 1);
  min-width: 348px;
  min-height: 192px;
  margin: 0 11px;
  overflow: hidden;
  user-select: none;
}

.carousel__item.active {
  min-width: 629px;
  min-height: 342px;
}

.carousel__item img {
  max-width: 100%;
  max-height: 100%;
}
</style>