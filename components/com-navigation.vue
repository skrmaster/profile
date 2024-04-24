<script lang="ts" setup>
type NavItemType = {
  link?: string;
  name?: string;
  type: 'link' | 'button' | 'theme';
  button?: Array<NavItemType>;
  flex?: number;
}

const navList: Array<NavItemType> = [
  {
    link: '/',
    name: '首页',
    type: 'link'
  },
  {
    link: '/project-list',
    name: '项目列表',
    type: 'link'
  },
  {
    link: '/record-list',
    name: '个人纪录',
    type: 'link'
  },
  {
    link: '/address-list',
    name: '地址导航',
    type: 'link'
  },
  {
    type: 'theme'
  },
  {
    type: 'button',
    button: [
      {
        type: 'link',
        link: '/login',
        name: '登录'
      },
      {
        type: 'link',
        link: '/signup',
        name: '注册'
      }
    ]
  }
]
const route = useRoute();
const currentPath = route.path;

function getFlex(arg: Array<NavItemType>): Array<NavItemType> {
  const argCopy = arg;
  let minV = (argCopy[0].name?.length || 0);
  const total = argCopy.reduce((pre, cur) => {
    const curLen = (cur.name?.length || 0);
    if (cur.type === 'link') {
      minV <= curLen ? 0 : minV = curLen;
    }
    return pre + (cur.name?.length || 1);
  }, 0);
  
  argCopy.forEach(e => {
    e.flex = e.name?.length ? e.name.length / total : minV / total;
    if (e.flex < 1 && e.flex > 0) {
      e.flex *= 10;
    }
  })

  return argCopy;
}

async function handleLink(url?: string) {
  await navigateTo({
    path: url
  })
}

function getLine(arg1?: NavItemType, arg2?: NavItemType): boolean {
  if (!arg1 || !arg2) {
    return false;
  }

  if (arg1?.type !== arg2?.type) {
    return true;
  } else {
    return false;
  }
}

</script>
<template>
  <div class="nav-box">
    <div class="container">
      <nav>
        <li 
          v-for="(item, index) in getFlex(navList)" 
          :key="index"
          class="nav__item flex__center"
          :style="`flex: ${item.flex}`"
          :class="{
            'is--active': item.link === currentPath
          }"
          :data-type="item.type"
        >
          <div 
            v-if="item.type === 'link'"
            class="item__box flex__center"
            @click="handleLink(item.link)"
            :class="{
              line: getLine(navList[index+1], item)
            }"
          >
            <span class="p1 nowrap">{{ item.name }}</span>
          </div>
          <div 
            v-if="item.type === 'theme'"
            class="item__box flex__center"
            :class="{
              line: getLine(navList[index+1], item)
            }"
          >
            <com-theme-button></com-theme-button>
          </div>
          <div 
            v-if="item.type === 'button'"
            class="item__box flex__center nowrap"
            :class="{
              line: getLine(navList[index+1], item)
            }"
          >
            <com-button 
              v-for="(e, i) in item.button" 
              :key="i"
              link
              :class="{
                mr1: i < item.button!.length - 1
              }"
              class="underline"
              @click="handleLink(e.link)"
            >{{ e.name }}</com-button>
          </div>
        </li>
      </nav>
    </div>
    <div class="line-wave__up"></div>
    <div class="line-wave__down"></div>
  </div>
</template>
<style scoped>
.nav-box {
  height: 80px;
  position: sticky;
  top: 0;
  z-index: 999;
  background-image: radial-gradient(transparent 1px, #eef1f5 1px);
  background-size: 6px 6px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);
}

.line-wave__up {
  width: 100%;
  position: absolute;
  bottom: 1px;
  height: 2px;
  background-image: linear-gradient(to right, 
    var(--primary-color) 50%, transparent 50%);
  background-size: 20px 100%;
}

.line-wave__down {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 2px;
  background-image: linear-gradient(to left, 
    var(--primary-color) 50%, transparent 50%);
  background-size: 20px 100%;
}

nav {
  margin-left: auto;
  max-width: 1000px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav__item {
  width: 100%;
  height: 100%;
  list-style: none;
  cursor: pointer;
  border-radius: 0 0 10px 10px;
}

[data-type="link"].nav__item:not(.is--active):hover {
  background: var(--readonly-color);
}

.nav__item.is--active {
  color: var(--white-color);
  background-color: var(--primary-color);
}

.item__box {
  height: 58px;
  width: 100%;
}

.line {
  border-right: 1px solid var(--primary-border-color);
}
</style>