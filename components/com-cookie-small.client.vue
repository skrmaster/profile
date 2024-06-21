<script lang="ts" setup>
const isDev = computed(() => {
  return import.meta.env.MODE === 'development';
});

const cookieAuth = useCookie("s-auth-cookie", {
  maxAge: 60 * 60 * 24 * 365 * 10,
  path: '/',
  secure: isDev ? false : true,
  sameSite: 'strict'
});

const emit = defineEmits<{
  'close': []
}>();

function handleAccept() {
  cookieAuth.value = 'true';
  close();
}

function handleDenial() {
  cookieAuth.value = 'false';
  close();
}

function close() {
  emit('close');
}

</script>
<template>
  <div class="cookie__box">
    <div class="container">
      <div class="flex__center">
        <div class="mr1">
          <div class="flex__row--between">
            <div>
              <p class="fs26">网站使用Cookies来改善您的浏览体验。</p>
            </div>
          </div>
          <div class="mt1">
            <h3>为什么使用Cookies?</h3>
            <p>Cookies是存储在用户设备上的小型文本文件，用于存储有关用户和他们在网站上活动的信息。这些信息可以包括登录状态、偏好等。</p>
          </div>
        </div>
      </div>
      <div class="button__box flex__row--between mt1">
          <div>
            <com-button
              class="accept"
              @click.stop="handleAccept"
            >全部接受</com-button>
          </div>
          <div>
            <com-button
              class="denial"
              plain 
              is-ripple
              @click.stop="handleDenial"
            >拒绝使用</com-button>
          </div>
        </div>
    </div>
  </div>
</template>
<style scoped>
.cookie__box {
  background-color: var(--white-color);
  position: fixed;
  bottom: 0;
  z-index: 990;
  width: 100%;
  min-height: 150px;
  padding: 20px;
  margin-bottom: 110px;
}

.button__box {
  max-width: 210px;
  width: 100%;
}

.denial {
  font-size: 12px;
  font-weight: bold;
  width: 100px;
  height: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.accept {
  font-size: 12px;
  font-weight: bold;
  width: 100px;
  height: 45px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>