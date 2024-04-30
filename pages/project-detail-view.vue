<script lang="ts" setup>

</script>
<template>
  <NuxtLayout 
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="false"
  >
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <section>
      <div class="container">
        <com-carousel></com-carousel>
      </div>
    </section>
  </NuxtLayout>
</template>
<style scoped>

</style>