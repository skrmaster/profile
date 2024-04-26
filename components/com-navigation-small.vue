<script lang="ts" setup>

const navList = ref([
  {
    name: '首页',
    icon: 'profilegithub'
  }
])
</script>
<template>
  <div class="navigation--small">
    <div>
      <com-avatar avatar-url="/images/pd3.png" nickname="五五开"></com-avatar>
    </div>
    <div></div>
    <div></div>
  </div>
</template>
<style scoped>
.navigation--small {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  min-height: 90px;
  max-width: 638px;
  width: 100%;
  background-color: rgb(238, 238, 238);
  /* background-image: radial-gradient(transparent 1px, rgb(238, 238, 238) 1px);
  background-size: 6px 6px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px); */
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  z-index: 99;
  border-radius: 45px;
}
</style>