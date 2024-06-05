<script lang="ts" setup>
import type { UserModel } from '~/api/user/model';

const {
  homePath,
  addressListPath,
  projectPagePath,
  recordPagePath,
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
    link: projectPagePath,
  },
  {
    name: '记录',
    icon: 'profile-blogs',
    link: recordPagePath,
  },
  {
    name: '地址',
    icon: 'profile-address',
    link: addressListPath,
  },
]);

const route = useRoute();
const currentIndex = ref(0);
const userInfo = useState<UserModel>('userInfo');
const currentUserInfo = computed(() => userInfo.value);

const tempUserInfo = ref<UserModel>({ ...currentUserInfo.value });

watchEffect(() => {
  const avatar: Upload.FileInfo = userInfo.value?.avatar ? JSON.parse(userInfo.value?.avatar) : "";
  tempUserInfo.value = { ...currentUserInfo.value, avatar: getAvatar(avatar) };
});

function isCurrentRoute(item: string) {
  let fullPath = route.fullPath;

  return item === fullPath;
}

function handleNav(index: number) {
  currentIndex.value = index;

  navigateTo({
    path: navList.value[index].link
  });
}
</script>
<template>
  <div>
    <div class="navigation--small px1">
      <div class="mr1">
        <com-avatar 
          :avatar-url="tempUserInfo?.avatar" 
          :nickname="tempUserInfo?.account || '未知'">
        </com-avatar>
      </div>
      <nav class="flex1 flex__row--between">
        <div 
          v-for="(item, index) in navList" 
          :key="index"
          class="navigation__item"
          :class="{
            'active': isCurrentRoute(item.link)
          }"
          @click="handleNav(index)"
        >
          <com-icon class="nav__icon" :icon="item.icon"></com-icon>
          <span v-show="isCurrentRoute(item.link)" class="fs18">{{ item.name }}</span>
        </div>
      </nav>
      <div class="theme__control flex__row--end">
        <com-theme-button></com-theme-button>
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
  min-height: 90px;
  max-width: 375px;
  width: 100%;
  background-color: rgb(238, 238, 238);
  /* background-image: radial-gradient(transparent 1px, rgb(238, 238, 238) 1px);
  background-size: 6px 6px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px); */
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  z-index: 999;
  border-radius: 45px;
  display: flex;
  align-items: center;
}

/* nav {
  margin: 0 -20px;
} */

.navigation__item {
  display: flex;
  align-items: center;
  transition: all .2s ease;
  transform-origin: center center;
}

.navigation__item.active {
  padding: 10px 18px;
  background: var(--nav-active-bg-color);
  border-radius: 5px;
}

.navigation__item.active .nav__icon {
  margin-right: 4px;
}


.theme__control {
  border-left: 2px solid var(--primary-border-color);
  max-width: 84px;
  width: 100%;
}
</style>