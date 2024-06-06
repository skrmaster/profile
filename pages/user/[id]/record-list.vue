<script lang="ts" setup>
import type { List, CountParam } from '~/api/record/model';
import PersonalCenter from './components/personal-center.vue';
import { apiCollectionList, apiRecordCount } from '~/api/record/request';

const { $dayjs, $confirm, $message } = useNuxtApp();
const { projectRecordtatus, recordCategory } = options;
const { recordDetailPath } = routerMap;
const paginationRef = ref();
const loading = ref(false);
const tableHead = ref<TableHead[]>([
  {
    name: '记录标题',
    field: 'title',
    width: '180px'
  },
  {
    name: '记录状态',
    width: '200px',
    field: 'status'
  },
  {
    name: '记录分类',
    width: '100px',
    field: 'category',
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
    fixed: 'right',
    width: '110px',
    type: 'div',
    slotName: 'cannel'
  }
]);
const tableData = ref<List>([]);
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20
});

function handleDelete(item: Record<string, any>) {
  const params: CountParam = {
    category: 3,
    recordId: item.id
  }

  $confirm.confirm({
    message: '请确认，这将会取消该记录的收藏'
  }).then(() => {
    apiRecordCount(params).then(_ => {
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

  apiCollectionList(params).then(res => {
    Object.assign(pagination ,res.data.pagination);
    tableData.value = res.data.list.map(e => {
      e.createTime = e.createTime ? $dayjs(e.createTime).format('YYYY-MM-DD HH:mm:ss') : '暂无';
      e.updateTime = e.updateTime ? $dayjs(e.updateTime).format('YYYY-MM-DD HH:mm:ss') : '暂无';
      e.status = getListLabel(e.status?.toString() ? e.status.toString() : "", projectRecordtatus) ?? '未知';
      e.category = getListLabel(e.category.toString(), recordCategory) ?? '未知';
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

function handleRecordDetail(id: string) {
  navigateTo({
    path: recordDetailPath + `/view`,
    query: {
      id
    }
  })
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
          <template #cannel="{ data }">
            <com-tip class="mx1" content="查看">
              <span class="operate__icon c-p" @click.stop="handleRecordDetail(data.id)">
                <com-icon icon="profile-see"></com-icon>
              </span>
            </com-tip>
            <com-tip content="取消收藏">
              <span class="operate__icon c-p" @click.stop="handleDelete(data)">
                <com-icon icon="profile-delete"></com-icon>
              </span>
            </com-tip>
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

.operate__icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: var(--table-th-bg-color);
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
}

.operate__icon:hover {
  opacity: 0.8;
}
</style>