<script lang="ts" setup>
import type { ListType } from '~/api/project/model';
import PersonalCenter from './components/personal-center.vue';
import { apiGetList, apiDelete } from '~/api/project/request';

const { $confirm, $message } = useNuxtApp();
const { tagList } = options;
const { projectDetailPath } = routerMap
const paginationRef = ref();
const loading = ref(false);
const tableHead = ref<TableHead[]>([
  {
    name: '项目名称',
    field: 'name',
    width: '180px'
  },
  {
    name: '项目开始时间',
    width: '200px',
    field: 'startTime'
  },
  {
    name: '项目结束时间',
    width: '200px',
    field: 'endTime',
  },
  {
    name: '项目概述',
    width: '200px',
    field: 'summary',
  },
  {
    name: '项目描述',
    width: '200px',
    field: 'description',
  },
  {
    name: '负责部分',
    width: '200px',
    field: 'department',
  },
  {
    name: '演示地址',
    width: '200px',
    field: 'playLink',
  },
  {
    name: '技术栈',
    width: '200px',
    field: 'stackIds',
  },
  {
    name: '项目图片',
    width: '200px',
    field: 'imageIds',
  },
  {
    name: '项目排序',
    width: '100px',
    field: 'sort',
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
    width: '150px',
    fixed: 'right',
    operate: ['view', 'edit', 'delete']
  }
]);
const tableData = ref<ListType>([]);
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20
});

function handleAdd() {
  navigateTo({
    path: `${projectDetailPath}/add`,
  });
}

function handleEdit(item: Record<string, any>) {
  navigateTo({
    path: `${projectDetailPath}/edit`,
    query: {
      id: item.id
    }
  });
}

function handleView(item: Record<string, any>) {
  navigateTo({
    path: `${projectDetailPath}/view`,
    query: {
      id: item.id
    }
  });
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
      e.startTime = timeNullFormat(e.startTime, 'YYYY-MM-DD');
      e.endTime = timeNullFormat(e.endTime, 'YYYY-MM-DD');
      e.createTime = timeNullFormat(e.createTime);
      e.updateTime = timeNullFormat(e.updateTime);
      e.category = getListLabel(e.category, tagList) || '';
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
    case 'view':
      handleView(data);
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
        <com-button icon="profileadd" @click="handleAdd">新增项目</com-button>
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