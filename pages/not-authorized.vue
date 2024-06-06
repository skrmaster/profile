<script setup>

const router = useRouter();

function handleGoBackPage() {
  router.go(-1);
}

</script>
<template>
  <div class="full__box">
    <div class="container">
      <div class="info flex__center">
        <div>
          <h1>拒绝访问</h1>
          <p>你没有权限查看该页面</p>
        </div>
        <div class="pt8">
          <com-button @click="handleGoBackPage">点击返回上一页</com-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.full__box {
  width: 100vw;
  height: 100vh;
}

.info {
  height: 100%;
  width: 100%;
  max-width: 500px;
  min-width: 200px;
  margin: 0 auto;
}
</style>