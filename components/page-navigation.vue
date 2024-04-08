<script lang="tsx" setup>

</script>
<template>
  <div class="nav-box">

    <div>

    </div>
    <div class="line-wave__up"></div>
    <div class="line-wave__down"></div>
  </div>
</template>
<style scoped>
.nav-box {
  height: 80px;
  position: relative;
}

.line-wave__up {
  width: 100%;
  position: absolute;
  bottom: 1px;
  height: 2px;
  background-image: linear-gradient(to right, var(--primary-color) 50%, transparent 50%);
  background-size: 20px 100%;
}

.line-wave__down {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 2px;
  background-image: linear-gradient(to left, var(--primary-color) 50%, transparent 50%);
  background-size: 20px 100%;
}
</style>