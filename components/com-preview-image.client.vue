<script lang="tsx" setup>
type Prop = {
  imageUrls?: Array<string | undefined>;
}

const props = withDefaults(defineProps<Prop>(), {
  imageUrls: () => [],
});

const visiable = ref(false);
const currentIndex = ref(0);
const enlarge = ref(1);
const enlargeStep = ref(0.5);
const rorateDeg = ref(0);
const rorateStep = ref(90);
const isLoaded = ref(false);
const duration = ref(0.2);
const imageRef = ref<HTMLElement>();

const minmax = computed(() => {
  return [0, props.imageUrls.length];
});

const cssRorate = computed(() => {
  return `rotate(${rorateDeg.value}deg)`;
});

const cssEnlarge = computed(() => {
  return `scale(${enlarge.value})`;
});

const styleList = computed(() => {
  return {
    transform: cssEnlarge.value + ' ' + cssRorate.value,
    transitionDuration: `${duration.value}s`
  };
});

function openModel() {
  visiable.value = true;
  nextTick(() => {
    isLoaded.value = true;
  });
}

function closeModel() {
  visiable.value = false;
}

function nextPic() {
  handleReset();
  if (minmax.value[1] - 1 === currentIndex.value) {
    currentIndex.value = 0;
    return
  }
  currentIndex.value++;
}

function prevPic() {
  handleReset();
  if (minmax.value[0] === currentIndex.value) {
    currentIndex.value = minmax.value[1] - 1;
    return
  }
  currentIndex.value--;
}

function generateImage() {
  if (isLoaded.value) {
    return (
      props.imageUrls.map((e, i: number) => {
        return <img
          ref={ i === currentIndex.value ? imageRef : undefined }
          id={ `id${i}` }
          v-drag 
          v-show={ i === currentIndex.value } 
          style={ styleList.value }
          src={ e } 
          alt="展示图片" 
        />
      })
    )
  }
}

function handleEnlarge(e: WheelEvent) {
  if (e.deltaY < 0) {
    scaleImage(1);
  } else {
    scaleImage(-1);
  }
}

function scaleImage(type: 1 | -1) {
  if (type === 1) {
    enlarge.value += enlargeStep.value;
    if (enlarge.value >= 5) {
      enlarge.value = 5;
      return;
    }
  } else {
    if (enlarge.value <= 0.5) {
      enlarge.value = 0.5;
      return;
    } else {
      enlarge.value -= enlargeStep.value;
    }
  }
}

function handleRotate(type: 1 | -1) {
  rorateDeg.value += type * rorateStep.value;
}

function handleReset() {
  duration.value = 0;
  enlarge.value = 1;
  rorateDeg.value = 0;
  if (imageRef.value) {
    imageRef.value.style.translate = '0 0';
  }
  setTimeout(() => {
    duration.value = 0.2;
  }, 0)
}

defineExpose({
  open: openModel
})
</script>
<template>
  <com-model 
    class="wh100 flex1"
    v-model="visiable" 
    to-body
    @wheel="handleEnlarge"
    @click="openModel"
  >
    <div class="image__box wh100 flex__center">
      <generateImage v-if="isLoaded" />
    </div>
    <div class="prev flex__center" @click="prevPic" title="上一张">
      <com-icon 
        width="20px" 
        height="20px" 
        color="var(--white-color)" 
        icon="profilearrow"
      ></com-icon>
    </div>
    <div class="next flex__center" @click="nextPic" title="下一张">
      <com-icon 
        width="20px" 
        height="20px" 
        color="var(--white-color)" 
        icon="profilearrow"
      ></com-icon>
    </div>
    <div class="close flex__center" title="关闭" @click.stop="closeModel">
      <com-icon 
        width="15px" 
        height="15px" 
        color="var(--white-color)" 
        class="close__icon" 
        icon="profileclose"
      ></com-icon>
    </div>
    <div class="control flex__row">
      <com-icon 
        width="20px" 
        height="20px" 
        color="var(--white-color)" 
        class="mx1" 
        icon="profileenlarge"
        title="放大"
        @click="scaleImage(1)"
      ></com-icon>
      <com-icon 
        width="20px" 
        height="20px" 
        color="var(--white-color)" 
        class="mx1" 
        icon="profileshrink" 
        title="缩小"
        @click="scaleImage(-1)"
      ></com-icon>
      <com-icon 
        width="20px" 
        height="20px" 
        color="var(--white-color)" 
        class="mx2" 
        icon="profilereset" 
        title="还原"
        @click="handleReset"
      ></com-icon>
      <com-icon 
        width="20px" 
        height="20px" 
        color="var(--white-color)" 
        class="mx1" 
        icon="profilerorate-left" 
        title="向左旋转"
        @click="handleRotate(-1)"
      ></com-icon>
      <com-icon 
        width="20px" 
        height="20px" 
        color="var(--white-color)" 
        class="mx1" 
        icon="profilerorate-right" 
        title="向右旋转"
        @click="handleRotate(1)"
      ></com-icon>
    </div>
  </com-model>
</template>
<style scoped>
.control {
  height: 50px;
  background: var(--model-control-bg-color);
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 25px;
  padding: 5px 10px;
  user-select: none;
}

.control__icon {
  height: 20px;
  width: 20px;
  color: var(--white-color);
}

.image__box {
  flex: 1;
}

.image__box>img {
  transition: all .2s ease; 
  user-select: none;
}

.prev {
  position: absolute;
  left: 20px;
  top: 50%;
  transform-origin: center center;
  transform: translateY(-50%) rotate(90deg);
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--model-control-bg-color);
  user-select: none;
}

.next {
  position: absolute;
  right: 20px;
  top: 50%;
  transform-origin: center center;
  transform: translateY(-50%) rotate(-90deg);
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--model-control-bg-color);
  user-select: none;
}

.close {
  cursor: pointer;
  position: absolute;
  right: 10%;
  top: 10%;
  transform: translateY(-50%);
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--model-control-bg-color);
  user-select: none;
}
</style>