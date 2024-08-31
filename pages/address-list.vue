<script lang="ts" setup>
import type { ListByCategory } from '~/api/address/model';
import { apiGetListByCategory } from '~/api/address/request';

useSeoMeta({
  title: `skrmaster-快速导航-供个人使用的一个网站地址导航页面`,
  description: `快速导航,${import.meta.env.VITE_PROJECT_DOMAIN}专注前端开发一个记录个人技术成长的网站，供个人使用的一个网站地址导航页面`,
  keywords: 'skrmaster,快速导航,导航,个人网站,skr,threejs,nuxtjs,nuxt3,nuxt,vue,vue3,vue3+ts,ts,typescript,记录,博客,踩坑,前端,web开发,ssr,服务端渲染的个人网站,服务端渲染',
  ogTitle: `skrmaster-快速导航-供个人使用的一个网站地址导航页面`,
  ogDescription: `快速导航,${import.meta.env.VITE_PROJECT_DOMAIN}专注前端开发一个记录个人技术成长的网站，供个人使用的一个网站地址导航页面`,
  ogImage: `https://${import.meta.env.VITE_PROJECT_DOMAIN}/images/og-address.png`,
  ogUrl: `https://${import.meta.env.VITE_PROJECT_DOMAIN}`,
  ogType: 'website',
    ogSiteName: 'skrmaster'
});

const { $dayjs } = useNuxtApp();
const data = ref<ListByCategory>([]);

const { data: listData } = await useAsyncData('address-list-data', () => apiGetListByCategory());

function fetchData() {
  const res = listData.value;

  if (!res) {
    return;
  }
  
  data.value = res.data.map((e) => {
    e.list = e.list.map(item => {
      item.createTime = $dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      item.updateTime = $dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
      return item;
    })
      
    return e;
  });
}

fetchData();
</script>
<template>
  <NuxtLayout 
    name="header-section-footer" 
    bg-change-color="true"
    bg-style-content="display: flex;flex-direction: column;min-height: 100vh;background-image: radial-gradient(var(--white-color) 0, var(--background-color) 100%);"
  >
    <section class="flex1" style="color: var(--primary-color)">
      <div class="container overflow-hidden">
        <div class="address">
          <div class="address__item"
            v-for="(item, index) in data"
            :key="index"
            v-show="item.list.length > 0"
          >
            <h3 class="address__title mt1">
              <com-icon v-show="item.category.iconClass" :icon="`profile-${item.category.iconClass}`"></com-icon>
              {{ item.category.name }}
            </h3>
            <div class="address__gird my1">
              <NuxtLink 
                class="link__item flex__row--between p1"
                v-for="(i, idx) in item.list"
                :key="idx"
                :to="i.link"
                target="_blank"
              >
                <div class="flex__row">
                  <div class="link__image flex__center">
                    <img :src="getImageHref(i.iconUrl)" :alt="i.name?.slice(0, 3) || 'icon'" />
                  </div>
                  <p class="link__title line2__ellipsis"><strong>{{ i.name }}</strong></p>
                </div>
                <com-icon class="rotate180" icon="profile-left"></com-icon>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
<style scoped>
.address {
  padding-bottom: 50px;
}

.address__gird {
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(242px, 1fr));
  gap: 30px;
}

.link__item {
  height: 72px;
  box-shadow: var(--box-shadow-small);
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  overflow: hidden;
  position: relative;
}

.link__item:hover {
  background-color: var(--white--color);
  border-color: var(--primary-border-color);
  box-shadow: var(--box-shadow-small);
  transform: translateY(-5px) scale(1.05);
  border-width: 2px;
}

.link__image {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.link__image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.link__title {
  margin: 0 5px;
}
</style>