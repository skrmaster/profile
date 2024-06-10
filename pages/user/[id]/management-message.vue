<script lang="ts" setup>
import type { ListType } from '~/api/message/model';
import PersonalCenter from './components/personal-center.vue';
import { apiGetList } from '~/api/message/request';

const { $dayjs } = useNuxtApp();
const formRef = ref();
const paginationRef = ref();
const loading = ref(false);
const tableHead = ref<TableHead[]>([
  {
    name: '姓名',
    field: 'userName',
    width: '180px'
  },
  {
    name: '联系方式',
    width: '200px',
    field: 'contactWay'
  },
  {
    name: '内容',
    width: '100px',
    field: 'content',
  },
  {
    name: '创建时间',
    field: 'createTime',
  },
  {
    name: '更新时间',
    field: 'updateTime',
  }
]);
const tableData = ref<ListType>([]);
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20
});

function getTableData() {
  loading.value = true;
  const params: Omit<Pagination, 'total'> = {
    page: pagination.page,
    pageSize: pagination.pageSize
  }

  apiGetList(params).then(res => {
    Object.assign(pagination ,res.data.pagination);
    tableData.value = res.data.list.map(e => {
      e.createTime = e.createTime ? $dayjs(e.createTime).format('YYYY-MM-DD HH:mm:ss') : '暂无';
      e.updateTime = e.updateTime ? $dayjs(e.updateTime).format('YYYY-MM-DD HH:mm:ss') : '暂无';
      return e;
    });
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function getTableDataByPagination() {
  pagination.page = 1;
  getTableData();
}

getTableData();
</script>
<template>
  <personal-center>
    <div class="main__content flex__column nowrap">
      <div class="flex1" v-loading="loading">
        <com-table :head="tableHead" :data="tableData">
          <template #image="{ data }">
            <div class="table__cell">
              <img class="table__image" :src="data.icon" :alt="data.name" />
            </div>
          </template>
        </com-table>
      </div>
      <div>
        <com-pagination
          ref="paginationRef"
          :total="pagination.total"
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          @page-size-change="getTableDataByPagination"
          @current-page-change="getTableData"
        ></com-pagination>
      </div>
    </div>
    <Form ref="formRef" @refresh-data="getTableData"></Form>
  </personal-center>
</template>
<style scoped>
.main__content {
  flex: 1;
  background: var(--white-color);
  border-radius: 10px;
  padding: 20px 16px;
}

.table__image {
  width: 20px;
  height: 20px;
}

.table__cell {
  padding: 5px 8px;
}
</style>