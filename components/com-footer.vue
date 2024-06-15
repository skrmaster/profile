<script lang="ts" setup>

const fontList = ref([
  {
    name: 'Vuejs',
    link: 'https://cn.vuejs.org'
  },
  {
    name: 'Nuxtjs',
    link: 'https://nuxt.com'
  },
  {
    name: 'typescript',
    link: 'https://www.typescriptlang.org'
  },
  {
    name: 'dayjs',
    link: 'https://day.js.org'
  },
  {
    name: 'wangeditor',
    link: 'https://www.wangeditor.com'
  },
  {
    name: 'threejs',
    link: 'https://threejs.org'
  },
  {
    name: 'sass',
    link: 'https://sass-lang.com'
  }
]);

const backList = ref([
  {
    name: '.net',
    link: 'https://dotnet.microsoft.com'
  },
  {
    name: 'furion',
    link: 'https://furion.net'
  },
  {
    name: 'SqlSugar',
    link: 'https://www.donet5.com'
  },
  {
    name: 'mysql',
    link: 'https://www.mysql.com'
  },
  {
    name: 'redis',
    link: 'https://redis.io'
  }
]);

const otherList = ref([
  {
    name: 'figma',
    link: 'https://www.figma.com'
  },
  {
    name: '蓝湖',
    link: 'https://lanhuapp.com/'
  }
]);

</script>
<template>
  <footer>
    <div class="container">
      <div class="footer__box">
        <div class="copyright flex__row">
          <p>Copyright<span class="copy">©</span>2024 skrmaster. All Rights Reserved</p>
        </div>
        <div class="thanks">
          <p class="mb1">特别感谢</p>
          <div class="thanks__box pl1">
            <ul>
              <li v-for="(item, index) in fontList" :key="index">
                <NuxtLink 
                  class="thanks__link underline" 
                  target="_blank" 
                  :to="item.link"
                >{{ item.name }}</NuxtLink>
              </li>
            </ul>
            <ul>
              <li v-for="(item, index) in backList" :key="index">
                <NuxtLink 
                  class="thanks__link underline" 
                  target="_blank" 
                  :to="item.link"
                >{{ item.name }}</NuxtLink>
              </li>
            </ul>
            <ul>
              <li v-for="(item, index) in otherList" :key="index">
                <NuxtLink 
                  class="thanks__link underline" 
                  target="_blank" 
                  :to="item.link"
                >{{ item.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped>
footer {
  border-top: 1px solid var(--primary-border-color)
}

.footer__box {
  color: var(--primary-color);
}

.copyright {
  padding: 0 20px;
  min-height: 80px;
  text-transform: uppercase;
}

.copy {
  margin: 0 5px;
}

.thanks {
  padding: 0 20px 30px 20px;
}

.thanks__box {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.thanks ul {
  list-style-type: none;
}

.thanks__link {
  text-transform: capitalize;
  margin-top: 5px;
}
</style>