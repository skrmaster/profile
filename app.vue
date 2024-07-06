<script lang="ts" setup>
import type { UserModel } from './api/user/model';
const userInfo = useState<UserModel | undefined>('userInfo');

onMounted(() => {
  const cookie = useCookie("s-getu");
  
  if (cookie.value && (cookie.value?.toString() !== false.toString()) && !userInfo.value?.id) {
    useUserInfo().then(res => {
      if (res) {
        userInfo.value = res;
      }
    });
  }
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style lang="scss">
@import '@wangeditor/editor/dist/css/style.css';
@import url('assets/css/gap.scss');
@import url('assets/css/theme.scss');
</style>