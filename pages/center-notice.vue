<script lang="ts" setup>
const time = ref(3);
let counter: ReturnType<typeof setTimeout>;

function wheel(callback: () => void) {
  return setTimeout(() => {
    time.value--;
    if (time.value === 0) {
      clearTimeout(counter);
      callback();
      return;
    }
    wheel(callback);
  }, 1000);
}

onNuxtReady(() => {
  counter = wheel(() => {
    navigateTo({
      path: '/login'
    })
  });
})
</script>
<template>
  <com-background
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
  >
    <div class="container">
      <div class="flex__center h100 fs24 text__box">
        <div>
          <p>注册完成👍，
            <span class="mr1">{{ time }}s</span>
            后即将自动跳转登录页面
          </p>
          <p>
            若没有自动跳转
            <NuxtLink to="/login">
              <span class="link">点击此处跳转</span>
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </com-background>
</template>
<style scoped>
.text__box {
  line-height: 1.8;
}

.link {
  text-decoration: underline;
  color: var(--error-color);
}
</style>