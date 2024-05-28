<script lang="ts" setup>
import { apiGetList, apiGetRankList, apiQueryList, apiRecordCount } from '~/api/record/request';
import type { List, ListItem, QueryParam, CountParam } from '~/api/record/model';

type RankItem = {
  id: string;
  name: string;
  fontSize: number;
  isBold: boolean;
}

useHead({
  title: "个人纪录"
});

const router = useRouter();
const route = useRoute();

const { recordDetailPath } = routerMap;
const searchVal = ref('');
const blogList = ref<List>([]);
const rank = ref<RankItem[]>([]);
const listLoading = ref(false);
const rankLoading = ref(false);
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
});

watch(searchVal, (val) => {
  if (!val) {
    getListData();
    redirectToCurrentWithQuery();
  } else {
    redirectToCurrentWithQuery({ q: val });
  }
});

init();
initRank();
function init() {
  const query = route.query?.q as string;
  searchVal.value = query || '';
  if (searchVal.value) {
    handleSearch();
  } else {
    getListData();
  }
}

function redirectToCurrentWithQuery (query?: Record<string, string>) {
  const currentPath = route.path
  router.push({ path: currentPath, query })
}

function initRank() {
  rankLoading.value = true;
  apiGetRankList(5).then(res => {
    rank.value = res.data.map((e, i) => {
      if (i < 3) {
        return {
          id: e.id,
          isBold: true,
          name: e.title,
          fontSize: 20
        }
      } else {
        return {
          id: e.id,
          isBold: false,
          name: e.title,
          fontSize: 20
        }
      }
    });
    rankLoading.value = false;
  }).catch(e => {
    rankLoading.value = false;
  });
}

function getListData() {
  listLoading.value = true;
  const params: Omit<Pagination, 'total'> = {
    page: pagination.page,
    pageSize: pagination.pageSize
  }

  apiGetList(params).then(res => {
    listLoading.value = false;
    Object.assign(pagination ,res.data.pagination);
    blogList.value = res.data.list.map(e => {
      const imageIds: Upload.FileInfo[] = e.coverImageUrl ? JSON.parse(e.coverImageUrl) : [];
      return {
        isTread: e.isDisLike,
        imageUrl: imageIds[0]?.fullPath,
        describe: e.subtitle ?? e.description,
        ...e
      }
    });
  }).catch(e => {
    console.log(e);
    listLoading.value = false;
  });
}

function handleSearch() {
  listLoading.value = true;
  const params: QueryParam = {
    title: searchVal.value,
    page: pagination.page,
    pageSize: pagination.pageSize
  }

  apiQueryList(params).then(res => {
    Object.assign(pagination ,res.data.pagination);
    blogList.value = res.data.list.map(e => {
      const imageIds: Upload.FileInfo[] = e.coverImageUrl ? JSON.parse(e.coverImageUrl) : [];
      return {
        isTread: e.isDisLike,
        imageUrl: imageIds[0].fullPath,
        describe: e.subtitle ?? e.description,
        ...e
      }
    });
    listLoading.value = false;
  }).catch(e => {
    console.log(e);
    
    listLoading.value = false;
  });
}

function getData() {
  if (searchVal.value) {
    handleSearch();
  } else {
    getListData();
  }
}

function getListDataByPagination() {
  pagination.page = 1;
  if (searchVal.value) {
    handleSearch();
  } else {
    getListData();
  }
}

function handleRecordDetail(id: string) {
  navigateTo({
    path: recordDetailPath + `/view`,
    query: {
      id
    }
  })
}

/**
 * category 0 - 查看, 1 - 点赞, 2 - 踩, 3 - 收藏
 */
function handleUserOperateRecord(index: number, item: ListItem, category: number) {
  const params: CountParam = {
    recordId: item.id,
    category
  }

  apiRecordCount(params).then(res => {
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
  }).catch(e => {
    
  });
}

</script>
<template>
  <com-background
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="false"
  >
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <com-search v-model="searchVal" @search="getListDataByPagination"></com-search>
    <section class="pb5">
      <div class="container">
        <div class="flex content">
          <div class="blog p1 flex__column overflow-auto" v-if="blogList.length > 0" v-loading="listLoading">
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
                      <div class="flex__row--end flex-wrap mt1">
                        <span class="mr1 flex__row">
                          <com-icon 
                            class="icon__gap" 
                            icon="profile-see">
                          </com-icon>
                          {{ item.view }}
                        </span>
                        <span class="mr1 flex__row">
                          <com-icon 
                            @click.stop="handleUserOperateRecord(index, item, 1)"
                            class="icon__gap" 
                            :icon="item.isLike 
                              ? 'profile-like-active' 
                              : 'profile-like1'
                            "
                          ></com-icon>
                          {{ item.like }}
                        </span>
                        <span class="mr1 flex__row">
                          <com-icon 
                            class="direction--reversal icon__gap" 
                            @click.stop="handleUserOperateRecord(index, item, 2)"
                            :icon="item.isTread 
                              ? 'profile-like-active' 
                              : 'profile-like1'"
                          ></com-icon>
                          {{ item.disLike }}
                        </span>
                        <span class="flex__row">
                          <com-icon 
                            class="icon__gap" 
                            @click.stop="handleUserOperateRecord(index, item, 3)"
                            :icon="item.isCollection 
                              ? 'profile-collection-active' 
                              : 'profile-collection'"
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
            <!-- <com-pagination
              ref="paginationRef"
              :pageSizes="[10, 20]"
              :total="pagination.total"
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.pageSize"
              @page-size-change="getListDataByPagination"
              @current-page-change="getData"
            ></com-pagination> -->
          </div>
          <com-empty v-else></com-empty>
          <div class="rank ml1 mt1 display-2-none display-1-none display-0-none">
            <p class="font-bold fs24">点击排行榜</p>
            <div v-if="rank.length > 0" v-loading="rankLoading">
              <div v-for="(item, index) in rank" 
                :key="index"
                class="rank__item c-p"
                :class="`fs${item.fontSize} 
                ${(item.isBold ? 'font-bold' : '')}`"
                @click="handleRecordDetail(item.id)"
              >
                <div 
                  style="display: inline-block; width: 52px!important;" 
                  class="mr1 text-center"
                >
                  <span 
                    :class="[
                      `rank__item-${index+1}`, 
                      {
                        'rank__special': index < 3
                      }
                    ]"
                  >
                    {{ index + 1 }}
                  </span>
                </div>
                <span style="display: inline-block">{{ item.name }}</span>
              </div>
            </div>
            <com-empty v-else></com-empty>
          </div>
        </div>
      </div>
    </section>
    <com-footer></com-footer>
  </com-background>
</template>
<style scoped>
.content {
  margin-top: 8rem;
}

.blog {
  max-width: 1000px;
  flex: 2 1 100%;
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
  transition: all .1s;
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
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  overflow: hidden;
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
}

.rank__item-3 {
  width: 38px;
  height: 38px;
  line-height: 38px;
  background-color: #cd7f32;
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