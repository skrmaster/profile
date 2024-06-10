<script lang="ts" setup>
import type { ListByCategory } from '~/api/address/model';
import { apiGetListByCategory } from '~/api/address/request';

const categoryList = [
  {
    name: '动漫',
    icon: 'profile-dongman1'
  }, 
  {
    name: '漫画',
    icon: 'profile-Icon_manhuaB'
  },
  {
    name: '影视',
    icon: 'profile-dongman'
  },
  {
    name: '小说',
    icon: 'profile-xiaoshuo'
  },
  {
    name: '游戏',
    icon: 'profile-youxi'
  }
];

useHead({
  title: '地址导航'
});

const { $dayjs } = useNuxtApp();
const data = ref<ListByCategory>([]);

function fetchData() {
  
  apiGetListByCategory()
  .then(res => {
    data.value = res.data.map((e) => {
      e.list = e.list.map(item => {
        item.createTime = $dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.updateTime = $dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
        return item;
      })

      return e;
    });
  }).catch(() => {});
}

fetchData();
</script>
<template>
  <NuxtLayout 
    name="header-section-footer" 
    bg-change-color 
    bg-style-content="
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-image: radial-gradient(var(--white-color) 0, var(--background-color) 100%);
    "
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
              <com-icon :icon="categoryList[index].icon"></com-icon>
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
                    <img :src="i.iconUrl" :alt="i.name?.slice(0, 3) || 'icon'" />
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