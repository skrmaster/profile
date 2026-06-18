<script lang="ts" setup>
import type { ListItem } from "~/api/project/model";
import { apiGetList } from "~/api/project/request";

const { projectDetailPath } = routerMap;
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20,
});

useSeoMeta({
  title: `skrmaster-项目列表-开发项目列表页面第${pagination.page}页`,
  description: `${import.meta.env.VITE_PROJECT_DOMAIN}专注前端开发一个记录个人技术成长的网站,供他人查看项目的已做开发项目列表页面`,
  keywords:
    "skrmaster,个人网站,项目展示,skr,threejs,nuxtjs,nuxt3,nuxt,vue,vue3,vue3+ts,ts,typescript,记录,博客,踩坑,前端,web开发,ssr,服务端渲染的个人网站,服务端渲染",
  ogTitle: `skrmaster-个人网站`,
  ogDescription: `${import.meta.env.VITE_PROJECT_DOMAIN}专注前端开发一个记录个人技术成长的网站,供他人查看项目的已做开发项目列表页面`,
  ogImage: `https://${import.meta.env.VITE_PROJECT_DOMAIN}/images/og-project-list.png`,
  ogUrl: `https://${import.meta.env.VITE_PROJECT_DOMAIN}`,
  ogType: "website",
  ogSiteName: "skrmaster",
});

const listLoading = ref(false);

const params: Omit<Pagination, "total"> = {
  page: 1,
  pageSize: 20,
};

const listData = computed(() => {
  return apiGetList({
    page: params.page,
    pageSize: params.pageSize,
  });
});

const data = computed(() => {
  return (listData.value?.list || []).map((e) => {
    const imageIds = e.imageIds ? JSON.parse(e.imageIds) : [];

    return {
      ...e,
      imageUrl: splicingImageUrl(imageIds[0]?.fullPath || ""),
    };
  });
});

function getData() {
  listLoading.value = false;

  Object.assign(pagination, listData.value?.pagination);
}

getData();

function handleViewProject(item: ListItem) {
  navigateTo({
    path: projectDetailPath + "/view",
    query: {
      id: item.id,
    },
  });
}

function getDataByPagination() {
  params.page = pagination.page;
  params.pageSize = pagination.pageSize;
}
</script>
<template>
  <com-background
    bg-change-color
    :bg-style-content="`display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-image: radial-gradient(var(--white-color) 0, var(--background-color) 100%);`"
  >
    <div class="h100 flex__column">
      <com-navigation
        class="display-2-none display-1-none display-0-none"
      ></com-navigation>
      <com-navigation-small
        class="display-5-none display-4-none display-3-none"
      ></com-navigation-small>
      <section class="flex1 overflow-auto">
        <div class="container">
          <div style="color: var(--primary-color)">
            <p class="py3 fs24">项目列表</p>
            <div
              class="project-gird pb2"
              v-loading="listLoading"
              :style="data.length === 0 ? `min-height: 200px;` : ''"
            >
              <div
                class="project__item"
                v-for="(item, index) in data"
                :key="index"
                @click="handleViewProject(item)"
              >
                <div class="project__image">
                  <img :src="item.imageUrl" alt="项目图片" />
                </div>
                <p class="text-center my1">{{ item.name }}</p>
              </div>
            </div>
            <com-empty v-if="!listLoading && data.length === 0"></com-empty>
          </div>
        </div>
      </section>
    </div>
  </com-background>
  <com-footer></com-footer>
  <div
    style="height: 120px"
    class="display-5-none display-4-none display-3-none"
  ></div>
</template>
<style scoped>
.project-gird {
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(311px, 1fr));
  gap: 30px;
}

.project__item {
  border-radius: 10px;
  background-color: var(--white-color);
  box-shadow: var(--box-shadow);
}

.project__image {
  height: 185px;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  cursor: pointer;
}

.project__image img {
  max-width: 100%;
  transition: all 0.2s ease-in-out;
}

.project__image img:hover {
  transform-origin: center center;
  transform: scale(1.2);
}
</style>
