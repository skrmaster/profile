<script lang="ts" setup>
type Prop = {
  info?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  info: '暂无数据'
});

</script>
<template>
  <div class="flex__center wh100 empty__box">
    <div class="p2">{{props.info}}</div>
  </div>
</template>
<style scoped>
.empty__box {
  background: var(--white-color);
}
</style>