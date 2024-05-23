<script lang="ts" setup>
import type { userModel } from '~/api/user/model';

type LinkType = {
  name: string;
  url: string;
}

type Prop = {
  avatarBlock?: boolean;
  closeButton?: boolean;
  height?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  avatarBlock: true,
  closeButton: false,
  height: '100%'
});

const route = useRoute();
const params = route.params;
const userInfo = useState<userModel>('userInfo');

const list = ref<LinkType[][]>([
  [
    {
      name: '账号信息',
      url: routerMap.userInfoPath,
    },
    {
      name: '关注的人',
      url: routerMap.followPath
    }
  ],
  [
    {
      name: '博客列表',
      url: routerMap.recordListPath
    },
    {
      name: '项目列表',
      url: routerMap.projectListPath
    }
  ],
  [
    {
      name: '技能管理',
      url: routerMap.skillMgtPath
    },
    {
      name: '标签管理',
      url: routerMap.tagMgtPath
    },
    {
      name: '项目管理',
      url: routerMap.projectMgtPath
    },
    {
      name: '博客管理',
      url: routerMap.recordMgtPath
    },
    {
      name: '名言警句管理',
      url: routerMap.aphorismsPath
    },
    {
      name: '地址导航管理',
      url: routerMap.navigationPath
    }
  ]
]);

function isCurrentRoute(item: string) {
  let fullPath = route.fullPath;
  item = item.replace(':id', params.id as string);

  return item === fullPath;
}

function handleJump(item: LinkType) {
  item.url = item.url.replace(':id', params.id as string);
  navigateTo(item.url, { replace: true });
}

onNuxtReady(() => {
  const localStorage = new StorageSuger("localStorage");
  const sectionStorage = new StorageSuger("sessionStorage");
  
  const userInfo1 = localStorage.getValue("userInfo");
  const userInfo2 = sectionStorage.getValue("userInfo");
  
  if (userInfo1) {
    userInfo.value = JSON.parse(userInfo1 as string);
  } else if (userInfo2) {
    userInfo.value = JSON.parse(userInfo2 as string);
  }
});
</script>
<template>
  <aside class="mr1" :style="{
    '--aside-height': props.height
  }">
    <div v-if="props.avatarBlock" class="flex__column--center">
      <com-avatar :nickname="userInfo?.account || '未知'" :avatar-url="userInfo?.avatar" ></com-avatar>
      <div class="flex__row--between mt1">
        <span class="mr1">关注: 0</span>
        <span>粉丝: 0</span>
      </div>
    </div>
    <div class="mt2">
      <div v-for="(item, index) in list" :key="index"
        class="mb2"
      >
        <div class="flex1 flex__column--center">
          <div 
            v-for="(e, i) in item" 
            :key="i" 
            class="nav__item flex__center flex1"
            :class="{
              'is--active': isCurrentRoute(e.url)
            }"
            @click="handleJump(e)"
          >
            <span class="link__name">{{ e.name }}</span>
            <com-icon class="link__icon" icon="profile-left"></com-icon>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
<style scoped>
aside {
  /* display: block; */
  max-width: 375px;
  width: 100%;
  min-height: var(--aside-height);
  background: var(--white-color);
  border-radius: 10px;
  box-shadow: var(--box-shadow-small);
  padding: 10px;
}

.link__name {
  font-size: 18px;
}

.link__icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform-origin: center center;
  transform: translateY(-50%) rotate(180deg);
}

.nav__item {
  width: 100%;
  position: relative;
  padding: 3px;
}

.nav__item:hover {
  cursor: pointer;
  border-radius: 10px;
  background-color: var(--nav-link-hover);
}

.nav__item.is--active {
  border-radius: 10px;
  background-color: var(--nav-link-bg);
}
</style>