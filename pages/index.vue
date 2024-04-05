<script lang="ts" setup>
const config: Pick<BackgroundSettingProps, "config"> = {
  config: {
    backgroundDefaultSize: true
  }
}

</script>
<template>
  <NuxtLayout name="background-setting" :config="config.config">
    <the-navigation></the-navigation>
  </NuxtLayout>
</template>
<style scoped>

</style>
