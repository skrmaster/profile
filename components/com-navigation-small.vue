<script lang="ts" setup>
import type { UserModel } from '~/api/user/model';

const {
  homePath,
  addressListPath,
  projectPagePath,
  recordPagePath,
  loginPath,
  userInfoPath
} = routerMap
const navList = ref([
  {
    name: '首页',
    icon: 'profile-home1',
    link: homePath,
  },
  {
    name: '项目',
    icon: 'profile-projects',
    link: '/project-list/1',
    query: {
      pageSize: 20
    },
  },
  {
    name: '记录',
    icon: 'profile-blogs',
    link: '/record-list/1',
    query: {
      pageSize: 10
    },
  },
  {
    name: '导航',
    icon: 'profile-address',
    link: addressListPath,
  },
]);

const route = useRoute();
const currentPath = route.path;
const currentIndex = ref(0);
const userInfo = useState<UserModel>('userInfo');
const currentUserInfo = computed(() => userInfo.value);

const tempUserInfo = ref<UserModel>({ ...currentUserInfo.value });

watchEffect(() => {
  const avatar: Upload.FileInfo = userInfo.value?.avatar ? JSON.parse(userInfo.value?.avatar) : "";
  tempUserInfo.value = { ...currentUserInfo.value, avatar: getImageUrl(avatar) };
});

function removeDigits(str: string): string {
  return str.replace(/\d+/g, '');
}

function hasCommonPartIgnoringNumbers(str1?: string, str2?: string): boolean {
  if (!str1 || !str2) {
    return false;
  }
  const str1WithoutDigits = removeDigits(str1);
  const str2WithoutDigits = removeDigits(str2);
  return str1WithoutDigits === str2WithoutDigits;
}

function handleNav(index: number, query?: Record<string, any>) {
  currentIndex.value = index;

  navigateTo({
    path: navList.value[index].link,
    query
  });
}

function handleAvatarJump() {
  if (currentUserInfo.value) {
    navigateTo({
      path: userInfoPath
    });
  } else {
    navigateTo({
      path: loginPath
    });
  }
}

</script>
<template>
  <div>
    <div class="navigation--small px1">
      <div class="avatar__gap" @click="handleAvatarJump">
        <com-avatar 
          :avatar-url="tempUserInfo?.avatar" 
          :nickname="tempUserInfo?.account ? tempUserInfo?.account : tempUserInfo?.id ? '未知' : '登录'">
        </com-avatar>
      </div>
      <nav class="flex1 flex__row--between">
        <div 
          v-for="(item, index) in navList" 
          :key="index"
          class="navigation__item"
          :class="{
            'active': hasCommonPartIgnoringNumbers(item.link, currentPath)
          }"
          @click="handleNav(index, item.query)"
        >
          <com-icon class="nav__icon" height="10px" width="10px" :icon="item.icon"></com-icon>
          <span  class="fs12">{{ item.name }}</span>
        </div>
      </nav>
      <div class="theme__control flex__center">
        <com-theme-button type="small"></com-theme-button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.navigation--small {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  min-height: 60px;
  max-width: 375px;
  width: 100%;
  overflow: auto hidden;
  background-color: var(--nav-small-bg);
  box-shadow: 0px 0px 10px 0px rgba(250, 250, 250, 0.25);
  z-index: 999;
  border-radius: 45px;
  display: flex;
  align-items: center;
}

.navigation__item {
  white-space: nowrap;
  display: flex;
  align-items: center;
  transition: all .2s ease;
  transform-origin: center center;
  padding: 5px 9px;
}

.navigation__item.active {
  background: var(--nav-small-item-active-bg);
  border-radius: 5px;
  color: var(--primary-color);
}

.navigation__item.active .nav__icon {
  margin-right: 4px;
}


.theme__control {
  border-left: 2px solid var(--primary-border-color);
  max-width: 65px;
  width: 100%;
}

.avatar__gap {
  margin-right: 8px;
}

:deep(.avatar) {
  height: 40px;
  width: 40px;
}

:deep(.icon__box) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>