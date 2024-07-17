<script lang="ts" setup>
const error = useError();
const isPageNotFound = computed(() => {
  return (error && error.value) ? error.value.statusCode === 404 : false;
});

function gohome() {
  navigateTo('/');
}

</script>
<template>
  <com-background
    bg-change-color 
    bg-style-content="
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-image: radial-gradient(var(--white-color) 0, var(--background-color) 100%);
    "
  >
    <div class="error-page flex__center">
      <div class="error__box" v-if="isPageNotFound">
        <div class="not-found">404</div>
        <p class="my1">未找到该页面</p>
        <div>
          <com-button @click="gohome">返回首页</com-button>
        </div>
      </div>
    </div>
  </com-background>
</template>
<style scoped>
.error-page {
  flex: 1;
}

.error__box {
  background: var(--white-color);
  padding: 50px 100px;
  box-shadow: var(--box-shadow-small);
  border-radius: 50px;
  text-align: center;
}

.not-found {
  font-size: 68px;
  font-weight: bold;
}
</style>