<script lang="ts" setup>
const fontList = ref([
  {
    name: "Vuejs",
    link: "https://cn.vuejs.org",
  },
  {
    name: "Nuxtjs",
    link: "https://nuxt.com",
  },
  {
    name: "typescript",
    link: "https://www.typescriptlang.org",
  },
  {
    name: "dayjs",
    link: "https://day.js.org",
  },
  {
    name: "wangeditor",
    link: "https://www.wangeditor.com",
  },
  {
    name: "threejs",
    link: "https://threejs.org",
  },
  {
    name: "sass",
    link: "https://sass-lang.com",
  },
]);

const backList = ref([
  {
    name: ".net",
    link: "https://dotnet.microsoft.com",
  },
  {
    name: "furion",
    link: "https://furion.net",
  },
  {
    name: "SqlSugar",
    link: "https://www.donet5.com",
  },
  {
    name: "mysql",
    link: "https://www.mysql.com",
  },
  {
    name: "redis",
    link: "https://redis.io",
  },
]);

const otherList = ref([
  {
    name: "figma",
    link: "https://www.figma.com",
  },
  {
    name: "蓝湖",
    link: "https://lanhuapp.com/",
  },
]);
</script>
<template>
  <footer>
    <div class="container">
      <div class="footer__box">
        <div class="thanks" style="padding-bottom: 20px">
          <p class="mb1">特别感谢</p>
          <div class="thanks__box pl1">
            <ul>
              <li v-for="(item, index) in fontList" :key="index">
                <NuxtLink
                  class="thanks__link underline"
                  target="_blank"
                  :to="item.link"
                  >{{ item.name }}</NuxtLink
                >
              </li>
            </ul>
            <ul>
              <li v-for="(item, index) in backList" :key="index">
                <NuxtLink
                  class="thanks__link underline"
                  target="_blank"
                  :to="item.link"
                  >{{ item.name }}</NuxtLink
                >
              </li>
            </ul>
            <ul>
              <li v-for="(item, index) in otherList" :key="index">
                <NuxtLink
                  class="thanks__link underline"
                  target="_blank"
                  :to="item.link"
                  >{{ item.name }}</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="copyright" v-if="false">
          <p class="mt1">
            Copyright<span class="copy">©</span>2024 skrmaster.top All Rights
            Reserved
          </p>
          <p class="gov flex__row">
            <img class="gov__img" src="assets/images/gov.png" />
            <NuxtLink
              class="gov__link fs14"
              target="_blank"
              to="https://beian.miit.gov.cn"
              >蜀ICP备2024083613号-3
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped>
footer {
  border-top: 1px solid var(--primary-border-color);
  background: var(--footer-bg);
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
  padding: 40px 20px 0 20px;
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

.gov {
  line-height: 80px;
}

.gov__img {
  width: 20px;
  margin-right: 5px;
}

.gov__link {
  text-decoration: underline;
}
</style>
