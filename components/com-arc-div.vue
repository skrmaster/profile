<script lang="ts" setup>
type Prop = {
  color?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  color: 'var(--primary-color)',
  placement: 'top',
  size: '80px'
})
</script>
<template>
  <div class="arc__box">
    <div class="arc" :style="{
      height: props.size
    }"></div>
  </div>
</template>
<style scoped>
.arc__box {
  width: 100%;
  position: relative;
  overflow: clip;
}

.arc {
  border-top: 1px solid var(--primary-border-color);
  border-radius: 80%/90% 80%/90% 0 0;
}
</style>