<script lang="ts" setup>

type Prop = {
  errorCode: number;
}

const props = defineProps<Prop>();

</script>
<template>
  <div>
    OOPs!出现了问题
    {{ props.errorCode }}
  </div>
</template>
<style scoped>

</style>