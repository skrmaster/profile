<script lang="ts" setup>
type Props = {
  icon: string;
  prefix?: '#icon'
}

const emit = defineEmits<{
  click: [event: Event]
}>()

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  prefix: '#icon'
});

const icon = computed((): string => {
  return `${props.prefix}-${props.icon}`
});


function handleClick($event: Event) {
  emit('click', $event);
}
</script>
<template>
  <svg
    v-if="props.icon"
    class="icon" 
    aria-hidden="true"
    v-bind="$attrs"
    @click="handleClick"
  >
    <use :xlink:href="icon"></use>
  </svg>
</template>
<style scoped>

</style>