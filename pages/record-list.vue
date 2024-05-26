<script lang="ts" setup>
import { apiGetList, apiGetRankList, apiQueryList } from '~/api/record/request';
import type { ListType, QueryParam } from '~/api/record/model';

type RankItem = {
  name: string;
  fontSize: number;
  isBold: boolean;
  }

useHead({
  title: "个人纪录"
});

const searchVal = ref('');
const blogList = ref<ListType>([]);
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
  }
});

init();
initRank();
function init() {
  getListData();
}

function initRank() {
  rankLoading.value = true;
  apiGetRankList(5).then(res => {
    rank.value = res.data.map((e, i) => {
      if (i < 3) {
        return {
          isBold: true,
          name: e.title,
          fontSize: 20
        }
      } else {
        return {
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
    Object.assign(pagination ,res.data.pagination);
    blogList.value = res.data.list.map(e => {
      return {
        isLike: false,
        isTread: false,
        isCollection: false,
        imageUrl: '/images/pd3.png',
        describe: '',
        ...e
      }
    });
    listLoading.value = false;
  }).catch(e => {
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
      return {
        isLike: false,
        isTread: false,
        isCollection: false,
        imageUrl: '/images/pd3.png',
        describe: '',
        ...e
      }
    });
    listLoading.value = false;
  }).catch(e => {
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
          <div class="blog" v-if="blogList.length > 0" v-loading="listLoading">
            <div 
              v-for="(item, index) in blogList" 
              :key="index"
              class="blog__item flex__column mb2"
            >
              <div class="mb1">
                <p class="fs22">{{ item.title }}</p>
              </div>
              <div class="flex flex1">
                <div class="flex flex1">
                  <div class="blog__content__box flex1 h100">
                    <div class="describe__box flex1 flex__column--between">
                      <p class="fs22 describe">{{ item.describe }}</p>
                      <div class="flex__row--end flex-nowrap mt1">
                        <span class="mr1 flex__row">
                          <com-icon 
                            class="icon__gap" 
                            icon="profile-see">
                          </com-icon>
                          {{ item.view }}
                        </span>
                        <span class="mr1 flex__row">
                          <com-icon 
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
                            :icon="item.isTread 
                              ? 'profile-like-active' 
                              : 'profile-like1'"
                          ></com-icon>
                          {{ item.disLike }}
                        </span>
                        <span class="flex__row">
                          <com-icon 
                            class="icon__gap" 
                            :icon="item.isCollection 
                              ? 'profile-collection-active' 
                              : 'profile-collection'"
                          ></com-icon>
                          {{ item.collection }}
                        </span>
                      </div>
                    </div>
                    <div class="thumbnail">
                      <img :src="item.imageUrl" />
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
              @page-size-change="getListDataByPagination"
              @current-page-change="getData"
            ></com-pagination>
          </div>
          <com-empty v-else></com-empty>
          <div class="rank">
            <p class="font-bold fs24">点击排行榜</p>
            <div v-if="rank.length > 0" v-loading="rankLoading">
              <div v-for="(item, index) in rank" 
                :key="index"
                class="rank__item"
                :class="`fs${item.fontSize} 
                ${(item.isBold ? 'font-bold' : '')}`"
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
  margin-left: -27px;
  margin-right: -27px;
}

.blog {
  max-width: 1000px;
  flex: 2 1 100%;
  margin: 0 27px;
}

.blog__item {
  cursor: pointer;
  border-radius: 20px;
  min-height: 320px;
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
  flex-flow: row nowrap;
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
  margin: 0 27px;
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
</style>