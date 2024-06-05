<script lang="ts" setup>
import { apiGetList }  from '~/api/project/request';
import type { ListType, ListItem }  from '~/api/project/model';

useHead({
  title: "项目列表"
});

const paginationRef = ref();

const { projectDetailPath } = routerMap;
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20
});
const data = ref<ListType>([]);

init();
function init() {
  getData();
}

function getData() {
  const params: Omit<Pagination, 'total'> = {
    page: pagination.page,
    pageSize: pagination.pageSize
  }

  apiGetList(params).then(res => {
    Object.assign(pagination ,res.data.pagination);
    data.value = res.data.list.map(e => {
      const imageIds: Upload.FileInfo[] = e.imageIds ? JSON.parse(e.imageIds) : [];
      return {
        ...e,
        name: e.name,
        imageUrl: splicingImageUrl(imageIds[0].fullPath) || ""
      };
    });
  }).catch(() => {
  });
}

function handleViewProject(item: ListItem) {
  navigateTo({
    path: projectDetailPath + '/view',
    query: {
      id: item.id
    }
  })
}

function getDataByPagination() {
  pagination.page = 1;
  getData();
}

</script>
<template>
  <com-background
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
  >
    <div class="h100 flex__column">
      <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
      <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
      <section class="flex1 overflow-auto">
        <div class="container">
          <div class="flex__row flex-wrap">
            <p class="my3 fs24">项目列表</p>
            <div class="project-gird" v-if="data.length > 0">
              <div class="project__item" 
                v-for="(item, index) in data" 
                :key="index"
                @click="handleViewProject(item)"
              >
                <div class="project__image">
                  <img :src="item.imageUrl" />
                </div>
                <p class="text-center my1">{{ item.name }}</p>
              </div>
            </div>
            <com-empty v-else></com-empty>
          </div>
        </div>
      </section>
      <com-pagination
        ref="paginationRef"
        :total="pagination.total"
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        @page-size-change="getDataByPagination"
        @current-page-change="getData"
      ></com-pagination>
      <com-footer></com-footer>
    </div>
  </com-background>
</template>
<style scoped>
.project-gird {
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
  transition: all .2s ease-in-out;
}

.project__image img:hover {
  transform-origin: center center;
  transform: scale(1.2);
}
</style>