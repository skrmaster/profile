<script lang="tsx" setup>
type Controls = 'enlarge' | 'shrink' | 'reset' | 'rorate-left' | 'rorate-right';
type Prop = {
  imageUrls?: Array<string | undefined>;
  controls?: Array<Controls>;
}

const props = withDefaults(defineProps<Prop>(), {
  imageUrls: () => [],
  controls: () => ['enlarge', 'shrink', 'reset', 'rorate-left', 'rorate-right'],
});

const visiable = ref(false);
const firstImageUrl = computed(() => {
  return props.imageUrls[0];
});
const currentImageUrl = ref<string | undefined>('');
const enlarge = ref(1);

function openModel() {
  currentImageUrl.value = firstImageUrl.value;
  visiable.value = true;
}

function generateControls(): VNode {
  return <div></div>
}

function handleEnlarge() {

}

defineExpose({
  open: openModel
})
</script>
<template>
  <com-model 
    v-model="visiable" 
    to-body 
    @click="openModel"
  >
    <div>
      <img :src="currentImageUrl" alt="展示图片" />
    </div>
    <div class="prev">

    </div>
    <div class="next">

    </div>
    <div class="control flex__row">
      <com-icon class="control__icon mx1" icon="profileenlarge" title="放大"></com-icon>
      <com-icon class="control__icon mx1" icon="profileshrink" title="缩小"></com-icon>
      <com-icon class="control__icon mx2" icon="profilereset" title="重置"></com-icon>
      <com-icon class="control__icon mx1" icon="profilerorate-left" title="向左旋转"></com-icon>
      <com-icon class="control__icon mx1" icon="profilerorate-right" title="向右旋转"></com-icon>
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
</style>