<script lang="ts" setup>
import {
  apiGetRankList,
  apiRecordCount,
  apiGetList,
} from "~/api/record/request";
import type {
  List,
  ListItem,
  QueryParam,
  CountParam,
} from "~/api/record/model";

type RankItem = {
  id: string;
  name: string;
  fontSize: number;
  isBold: boolean;
};

const route = useRoute();
const param = route.params;
const page = param.list as unknown as number;
const pageSize = route.query?.pageSize as unknown as number;

useSeoMeta({
  title: `skrmaster-个人记录-博客列表方便查看各种坑第${page}页`,
  description: `${import.meta.env.VITE_PROJECT_DOMAIN}专注前端开发一个记录个人技术成长的网站,供他人查看项目的已做开发项目列表页面`,
  keywords:
    "skrmaster,个人网站,项目展示,skr,threejs,nuxtjs,nuxt3,nuxt2,nuxt,vue,vue3,vue3+ts,ts,typescript,记录,博客,踩坑,前端,web开发,ssr,服务端渲染的个人网站,服务端渲染",
  ogTitle: `skrmaster-个人记录`,
  ogDescription: `${import.meta.env.VITE_PROJECT_DOMAIN}专注前端开发一个记录个人技术成长的网站,供他人查看项目的已做开发项目列表页面`,
  ogImage: `https://${import.meta.env.VITE_PROJECT_DOMAIN}/images/og-record-list.png`,
  ogUrl: `https://${import.meta.env.VITE_PROJECT_DOMAIN}`,
  ogType: "website",
  ogSiteName: "skrmaster",
});

const { recordDetailPath } = routerMap;
const searchVal = ref("");
const blogList = ref<List>([]);
const rank = ref<RankItem[]>([]);
const listLoading = ref(false);
const rankLoading = ref(false);
const pagination = reactive({
  total: 0,
  page: page * 1,
  pageSize: (pageSize || 10) * 1,
});

const query = route.query?.q as string;
searchVal.value = query || "";

const params: QueryParam = {
  title: query,
  page: page * 1,
  pageSize: (pageSize || 10) * 1,
};

if (query) {
  params.page = 1;
}

const { data: rankData } = await useAsyncData(`rank-data`, () =>
  apiGetRankList(5),
);
const { data: listData } = await useAsyncData(
  `record-${pagination.page}-${pagination.pageSize}-list`,
  () => apiGetList(params),
);

function init() {
  initRank();
  getListData();
}

function initRank() {
  const res = rankData.value;
  if (!res) {
    return;
  }

  rankLoading.value = true;
  rank.value = res.data.map((e, i) => {
    if (i < 3) {
      return {
        id: e.id,
        isBold: true,
        name: e.title,
        fontSize: 20,
      };
    } else {
      return {
        id: e.id,
        isBold: false,
        name: e.title,
        fontSize: 20,
      };
    }
  });
  rankLoading.value = false;
}

function getListData() {
  Object.assign(pagination, listData.value?.pagination);
  blogList.value =
    listData.value?.list.map((e) => {
      const imageIds: Upload.FileInfo[] = e.coverImageUrl
        ? JSON.parse(e.coverImageUrl)
        : [];
      return {
        isTread: e.isDisLike,
        imageUrl: splicingImageUrl(imageIds[0]?.fullPath),
        describe: e.subtitle || e.description,
        ...e,
      };
    }) || [];
}

async function handleJumpPage() {
  let currentPage = pagination.page;
  if (searchVal.value) {
    currentPage = 1;
  }
  await navigateTo({
    path: `/record-list/${currentPage}`,
    query: {
      pageSize: pagination.pageSize,
      q: searchVal.value || undefined,
    },
  });
}

async function handleSearchRecord() {
  let currentPage = pagination.page;
  if (searchVal.value) {
    currentPage = 1;
  }

  await navigateTo({
    path: `/searched/${currentPage}`,
    query: {
      pageSize: pagination.pageSize,
      q: searchVal.value || undefined,
    },
  });
}

function handleRecordDetail(id: string) {
  navigateTo({
    path: recordDetailPath + `/view`,
    query: {
      id,
    },
  });
}

/**
 * category 0 - 查看, 1 - 点赞, 2 - 踩, 3 - 收藏
 */
function handleUserOperateRecord(
  index: number,
  item: ListItem,
  category: number,
) {
  const params: CountParam = {
    recordId: item.id,
    category,
  };

  apiRecordCount(params)
    .then((res) => {
      if (res.succeeded) {
        if (category === 1) {
          blogList.value[index].isLike = !item.isLike;
          if (blogList.value[index].isLike) {
            blogList.value[index].like += 1;
          } else {
            blogList.value[index].like -= 1;
          }
        } else if (category === 2) {
          blogList.value[index].isTread = !item.isTread;
          if (blogList.value[index].isTread) {
            blogList.value[index].disLike += 1;
            blogList.value[index].isLike = false;
            blogList.value[index].like -= 1;
          } else {
            blogList.value[index].disLike -= 1;
          }
        } else {
          blogList.value[index].isCollection = !item.isCollection;
          if (blogList.value[index].isCollection) {
            blogList.value[index].collection += 1;
          } else {
            blogList.value[index].collection -= 1;
          }
        }
      }
    })
    .catch((e) => {});
}

onNuxtReady(() => {
  init();
});
</script>
<template>
  <com-background
    bg-change-color
    bg-style-content="
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-image: radial-gradient(var(--white-color) 0, var(--background-color) 100%);
    "
  >
    <com-navigation
      class="display-2-none display-1-none display-0-none"
    ></com-navigation>
    <com-navigation-small
      class="display-5-none display-4-none display-3-none"
    ></com-navigation-small>
    <com-search v-model="searchVal" @search="handleSearchRecord"></com-search>
    <section class="pb5 flex1">
      <div class="container">
        <div class="flex content">
          <div
            class="blog p1 flex__column overflow-auto"
            v-loading="listLoading"
            :style="blogList.length === 0 ? `min-height: 200px;` : ''"
          >
            <div
              v-for="(item, index) in blogList"
              :key="index"
              class="blog__item flex__column mb2"
              @click="handleRecordDetail(item.id)"
            >
              <div class="mb1">
                <p class="fs22">{{ item.title }}</p>
              </div>
              <div class="flex flex1">
                <div class="flex flex1">
                  <div class="blog__content__box flex1 h100">
                    <div class="describe__box flex1 flex__column--between">
                      <p class="fs16 describe">{{ item.describe }}</p>
                      <div class="flex__row--end flex-wrap mt1" v-if="false">
                        <span class="mr1 flex__row">
                          <com-icon class="icon__gap" icon="profile-see">
                          </com-icon>
                          {{ item.view }}
                        </span>
                        <span class="mr1 flex__row">
                          <com-icon
                            @click.stop="
                              handleUserOperateRecord(index, item, 1)
                            "
                            class="icon__gap"
                            :icon="
                              item.isLike
                                ? 'profile-like-active'
                                : 'profile-like1'
                            "
                          ></com-icon>
                          {{ item.like }}
                        </span>
                        <span class="mr1 flex__row">
                          <com-icon
                            class="direction--reversal icon__gap"
                            @click.stop="
                              handleUserOperateRecord(index, item, 2)
                            "
                            :icon="
                              item.isTread
                                ? 'profile-like-active'
                                : 'profile-like1'
                            "
                          ></com-icon>
                          {{ item.disLike }}
                        </span>
                        <span class="flex__row">
                          <com-icon
                            class="icon__gap"
                            @click.stop="
                              handleUserOperateRecord(index, item, 3)
                            "
                            :icon="
                              item.isCollection
                                ? 'profile-collection-active'
                                : 'profile-collection'
                            "
                          ></com-icon>
                          {{ item.collection }}
                        </span>
                      </div>
                    </div>
                    <div class="thumbnail display-0-none pb2">
                      <img v-if="item.imageUrl" :src="item.imageUrl" />
                      <div v-else class="image__seat wh100">
                        <com-empty info="暂无封面"></com-empty>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <com-pagination
              ref="paginationRef"
              :pageSizes="[10, 20]"
              :total="pagination.total"
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.pageSize"
              @page-size-change="handleJumpPage"
              @current-page-change="handleJumpPage"
            ></com-pagination>
          </div>
          <com-empty v-if="!listLoading && blogList.length === 0"></com-empty>
          <div
            v-if="false"
            class="rank ml1 mt1 display-2-none display-1-none display-0-none"
          >
            <p class="font-bold fs24">点击排行榜</p>
            <div v-loading="rankLoading">
              <div
                v-for="(item, index) in rank"
                :key="index"
                class="rank__item c-p flex__row"
                :class="`fs${item.fontSize}
                ${item.isBold ? 'font-bold' : ''}`"
                @click="handleRecordDetail(item.id)"
              >
                <div
                  style="display: inline-block; width: 52px !important"
                  class="mr1 text-center"
                >
                  <span
                    :class="[
                      `rank__item-${index + 1}`,
                      {
                        rank__special: index < 3,
                      },
                    ]"
                  >
                    {{ index + 1 }}
                  </span>
                </div>
                <div class="line1__ellipsis">{{ item.name }}</div>
              </div>
            </div>
            <com-empty v-if="!listLoading && rank.length === 0"></com-empty>
          </div>
        </div>
      </div>
    </section>
    <com-footer></com-footer>
  </com-background>
  <div
    style="height: 120px"
    class="display-5-none display-4-none display-3-none"
  ></div>
</template>
<style scoped>
.content {
  margin-top: 8rem;
}

.blog {
  max-width: 1000px;
  margin-inline: auto;
}

.blog__item {
  cursor: pointer;
  border-radius: 20px;
  min-height: 300px;
  max-width: 1000px;
  width: 100%;
  background: var(--white-color);
  padding: 32px;
  box-shadow: var(--box-shadow-small);
  transition: all 0.1s;
}

.blog__item:hover {
  box-shadow: var(--box-shadow);
}

.blog__content__box {
  display: flex;
  align-items: center;
  margin: 0 -12.5px;
}

.describe__box {
  height: 100%;
  margin: 0 12.5px;
}

.describe {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.4;
}

.thumbnail {
  max-width: 243px;
  width: 100%;
  height: 100%;
  margin: 0 12.5px;
}

.thumbnail img {
  width: 100%;
}

.icon__gap {
  margin-right: 5px;
}

.rank {
  max-width: 447px;
  height: 782px;
  height: 100%;
  flex: 1 1 100%;
  background: var(--white-color);
  border-radius: 20px;
  padding: 36px;
  box-shadow: var(--box-shadow-small);
  position: sticky;
  top: 100px;
}

.rank__item {
  padding: 18px 0;
}

.rank__item:not(:last-child) {
  border-bottom: 1px dashed var(--primary-border-color);
}

span[class^="rank__item-"] {
  display: inline-block;
  text-align: center;
}

.rank__special {
  border-radius: 50%;
}

.rank__item-1 {
  width: 38px;
  height: 38px;
  line-height: 38px;
  background-color: #ffd700;
  color: #fff;
}

.rank__item-2 {
  width: 38px;
  height: 38px;
  line-height: 38px;
  background-color: #c0c0c0;
  color: #fff;
}

.rank__item-3 {
  width: 38px;
  height: 38px;
  line-height: 38px;
  background-color: #cd7f32;
  color: #fff;
}

span[class^="rank__item-"]:not(.rank__special) {
  width: 34px;
  height: 34px;
  line-height: 34px;
}

.image__seat {
  background: var(--image-element-seat-bg);
}
</style>
