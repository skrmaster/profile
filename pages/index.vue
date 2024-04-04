<script lang="ts" setup>
const config: Pick<BackgroundSettingProps, "config"> = {
  config: {
    backgroundDefaultSize: true
  }
}

</script>
<template>
  <NuxtLayout name="background-setting" :config="config.config">
    1234
  </NuxtLayout>
</template>
<style scoped>

</style>
