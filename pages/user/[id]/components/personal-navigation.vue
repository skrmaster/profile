<script lang="ts" setup>
import type { UserModel } from '~/api/user/model';
import { isPathInList, hasPermissions, getUserPermissions } from '~/middleware/auth.global'

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
  avatarBlock: false,
  closeButton: false,
  height: '100%'
});

const route = useRoute();
const params = route.params;
const userInfo = useState<UserModel>('userInfo');
const currentUserInfo = computed(() => userInfo.value);
const tempUserInfo = ref<UserModel>({ ...currentUserInfo.value });
const list = ref<Array<Array<LinkType | undefined>>>([
  [
    {
      name: '账号信息',
      url: routerMap.userInfoPath,
    },
    // {
    //   name: '关注的人',
    //   url: routerMap.followPath
    // },
    {
      name: '收藏列表',
      url: routerMap.recordListPath
    }
  ]
]);
const listMore = ref<Array<LinkType | undefined>>([
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
    name: '语录管理',
    url: routerMap.aphorismsPath
  },
  {
    name: '留言管理',
    url: routerMap.userMessagePath
  },
  {
    name: '地址导航管理',
    url: routerMap.navigationPath
  }
]);

watchEffect(() => {
  const avatar: Upload.FileInfo = userInfo.value?.avatar ? JSON.parse(userInfo.value?.avatar) : "";
  tempUserInfo.value = { ...currentUserInfo.value, avatar: getAvatar(avatar) };
});

auth();
async function auth() {
  const items = await Promise.all(
    listMore.value.map(async (item) => {
      const userPermissions = await getUserPermissions();
      const auth = item && item.url ? hasPermissions(item.url, userPermissions) : false;

      if (item && item.url && isPathInList(item.url) && auth) {
        return item
      } else {
        return undefined;
      }
    })
  );
  listMore.value = items.flatMap((item) => item ? [item] : []);
  list.value = list.value.concat([listMore.value]);
}

function isCurrentRoute(item: string) {
  let fullPath = route.fullPath;
  item = item.replace(':id', params.id as string);

  return item === fullPath;
}

function handleJump(item?: LinkType) {
  if (item) {
    item.url = item.url.replace(':id', params.id as string);
    navigateTo(item.url, { replace: true });
  }
  
}
</script>
<template>
  <aside class="mr1" :style="{
    '--aside-height': props.height
  }">
    <div v-if="props.avatarBlock" class="flex__column--center">
      <com-avatar :nickname="tempUserInfo?.account || '未知'" :avatar-url="tempUserInfo?.avatar" ></com-avatar>
      <p>{{ tempUserInfo?.account }}</p>
      <!-- <div class="flex__row--between mt1">
        <span class="mr1">关注: 0</span>
        <span>粉丝: 0</span>
      </div> -->
    </div>
    <div class="mt2">
      <div v-for="(item, index) in list" :key="index"
        class="mb2"
      >
        <div class="flex1 flex__column--center">
          <template 
            v-for="(e, i) in item"  
            :key="i" 
          >
            <div
              v-if="e"
              class="nav__item flex__center flex1"
              :class="{
                'is--active': isCurrentRoute(e ? e.url : '')
              }"
              @click="handleJump(e)"
            >
              <span class="link__name">{{ e ? e.name : '' }}</span>
              <com-icon class="link__icon" icon="profile-left"></com-icon>
            </div>
          </template>
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
  background-color: var(--nav-link-hover);
}
</style>