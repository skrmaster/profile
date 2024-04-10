<script lang="ts" setup>
type Props = {
  type?: string
  plain?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  plain: false
})
</script>
<template>
  <button class="btn c-p">
    <slot />
  </button>
</template>
<style scoped>

.btn{
  border-radius: 50px;
  border: solid 5px var(--white-color);
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2), inset 0px 0px 8px 0px rgba(255, 255, 255, 0.9);
  width: 347px;
  height: 66px;
  background: var(--primary-color);
  color: var(--white-color);
  font-size: 24px;
}

.btn:active {
  opacity: 1;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
}
</style>