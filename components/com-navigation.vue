<script lang="tsx" setup>
type NavItemType = {
  link?: string;
  name?: string;
  type: 'link' | 'button' | 'theme',
  button?: Record<string, NavItemType>
}

const navList: Array<NavItemType> = [
  {
    link: '/',
    name: '首页',
    type: 'link'
  },
  {
    link: '',
    name: '项目列表',
    type: 'link'
  },
  {
    link: '',
    name: '个人纪录',
    type: 'link'
  },
  {
    link: '',
    name: '地址导航',
    type: 'link'
  },
  {
    type: 'theme'
  },
  {
    type: 'button',
    button: {
      login: {
        type: 'link',
        link: '/login',
      },
      signup: {
        type: 'link',
        link: '/signup'
      }
    }
  }
]

</script>
<template>
  <div class="nav-box">
    <div class="container">
      <nav class="offset-4">
        <li 
          v-for="(item, index) in navList" 
          :key="index"
          class="nav__item flex__center"
        >
          <div 
            class="item__box flex__center" 
            v-if="item.type === 'link'"
          >
            <span>{{ item.name }}</span>
          </div>
          <div v-if="item.type === 'theme'">
            <com-theme-button></com-theme-button>
          </div>
          <div v-if="item.type === 'button'">
          
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
  position: relative;
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
  height: 100%;
  display: flex;
  align-items: center;
}

nav li {
  width: 100%;
  height: 100%;
  list-style: none;
  cursor: pointer;
}

.nav__item {

}

.item__box {
  height: 58px;
}
</style>