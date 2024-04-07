<script lang="ts" setup>
useHead({
  title: "登录"
})
</script>
<template>
  <NuxtLayout 
    name="background-setting" 
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
    class="flex__center"
  >
    <div class="login-box">

    </div>
  </NuxtLayout>
</template>
<style scoped>

.login-box {
  margin: 0 0.25rem;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  width: 1411px;
  height: 867px;
  border-top: 16px solid var(--primary-border-color);
  background-size: 10px 10px;
  background-image: radial-gradient(circle at center, #ebebeb 10%, transparent 20%);
  overflow: hidden;
}
</style> 