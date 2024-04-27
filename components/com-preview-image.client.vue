<script lang="tsx" setup>
type Prop = {
  imageUrls?: Array<string | undefined>;
}

const props = withDefaults(defineProps<Prop>(), {
  imageUrls: () => [],
});

const visiable = ref(false);
const currentImageUrl = ref<string | undefined>();
const enlarge = ref(1);
const enlargeStep = ref(0.5);
const rorateDeg = ref(0);
const rorateStep = ref(90);
const isLoaded = ref(false);

const firstImageUrl = computed(() => {
  return props.imageUrls[0];
});

const cssRorate = computed(() => {
  return `rotate(${rorateDeg.value}deg)`;
});

const cssEnlarge = computed(() => {
  return `scale(${enlarge.value})`;
});

const styleList = computed(() => {
  return {
    transform: cssEnlarge.value + ' ' + cssRorate.value
  };
});

function openModel() {
  currentImageUrl.value = firstImageUrl.value;
  visiable.value = true;
  isLoaded.value = true;
}

function closeModel() {
  visiable.value = false;
  isLoaded.value = false;
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
  enlarge.value = 1;
  rorateDeg.value = 0;
}

defineExpose({
  open: openModel
})
</script>
<template>
  <com-model 
    class="wh100 flex1 flex__center"
    v-model="visiable" 
    to-body
    @wheel="handleEnlarge"
    @click="openModel"
  >
    <div class="image__box">
      <img v-drag="isLoaded" :style="styleList" :src="currentImageUrl" alt="展示图片" />
    </div>
    <div class="prev flex__center">
      <com-icon class="control__icon" icon="profilearrow"></com-icon>
    </div>
    <div class="next flex__center">
      <com-icon class="control__icon" icon="profilearrow"></com-icon>
    </div>
    <div class="close flex__center" @click="closeModel">
      <com-icon class="close__icon" icon="profileclose-circle"></com-icon>
    </div>
    <div class="control flex__row">
      <com-icon class="control__icon mx1" icon="profileenlarge" @click="scaleImage(1)"></com-icon>
      <com-icon class="control__icon mx1" icon="profileshrink" @click="scaleImage(-1)"></com-icon>
      <com-icon class="control__icon mx2" icon="profilereset" @click="handleReset"></com-icon>
      <com-icon class="control__icon mx1" icon="profilerorate-left" @click="handleRotate(-1)"></com-icon>
      <com-icon class="control__icon mx1" icon="profilerorate-right" @click="handleRotate(1)"></com-icon>
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
}

.control__icon {
  height: 20px;
  width: 20px;
  color: var(--white-color);
}

.image__box img {
  transform-origin: center center;
  transition: all .3s ease; 
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
}

.close {
  position: absolute;
  right: 10%;
  top: 10%;
  transform: translateY(-50%);
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--model-control-bg-color);
}

.close__icon {
  height: 40px;
  width: 40px;
  color: var(--white-color);
}
</style>