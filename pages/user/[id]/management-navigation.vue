<script lang="ts" setup>
import type { ListType } from '~/api/address/model';
import PersonalCenter from './components/personal-center.vue';
import Form from './components/form-address.vue';
import { apiGetList, apiDelete } from '~/api/address/request';

const { $dayjs, $confirm, $message } = useNuxtApp();
const { addressNavigationList } = options;
const formRef = ref();
const paginationRef = ref();
const loading = ref(false);
const tableHead = ref<TableHead[]>([
  {
    name: '名称',
    field: 'name',
    width: '180px'
  },
  {
    name: '链接',
    width: '250px',
    field: 'link',
  },
  {
    name: '分类',
    width: '100px',
    field: 'category',
  },
  {
    name: '图标icon',
    width: '150px',
    field: 'iconUrl',
  },
  {
    name: '创建时间',
    field: 'createTime',
  },
  {
    name: '更新时间',
    field: 'updateTime',
  },
  {
    name: '操作',
    width: '100px',
    operate: ['edit', 'delete']
  }
]);
const tableData = ref<ListType>([]);
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20
});

function handleAdd() {
  formRef.value.open();
}

function handleEdit(item: Record<string, any>) {
  formRef.value.open(item);
}

function handleDelete(item: Record<string, any>) {
  $confirm.confirm({
    message: '请确认，这将会删除该条数据'
  }).then(() => {
    apiDelete(item.id).then(_ => {
      $message.show({
        type: 'success',
        message: '操作成功'
      });
      getTableData();
    });
  }).catch(() => {});
}

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
      e.category = getListLabel(e.category.toString(), addressNavigationList) || '';
      return e;
    });
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function handleTableClick(type: TableCell, data: Record<string, any>) {
  switch (type) {
    case 'edit':
      handleEdit(data);
      break;
    case 'delete':
      handleDelete(data);
      break;
    case 'cell':
      break;
    default:
      break;
  }
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
      <div class="mb1">
        <com-button icon="profileadd" @click="handleAdd">新增导航地址</com-button>
      </div>
      <div class="flex1" v-loading="loading">
        <com-table :head="tableHead" :data="tableData" @click="handleTableClick">
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