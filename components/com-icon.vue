<script lang="ts" setup>
type Props = {
  icon?: string;
  prefix?: '#icon';
  width?: string;
  height?: string;
  color?: string;
}

const emit = defineEmits<{
  click: [event: Event]
}>();

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  prefix: '#icon',
  width: '1em',
  height: '1em',
  color: '#333'
});

const icon = computed((): string => {
  return `${props.prefix}-${props.icon}`
});

function handleClick($event: Event) {
  emit('click', $event);
}
</script>
<template>
  <span class="icon__box">
    <svg v-if="props.icon" class="icon" aria-hidden="true" @click="handleClick" :style="{
      width: props.width,
      height: props.height,
      color: props.color
    }">
      <use :xlink:href="icon"></use>
    </svg>
  </span>
</template>
<style scoped>
.icon__box {
  text-align: center;
  color: inherit;
}

.icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
}
</style>
