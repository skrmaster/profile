<script lang="ts" setup>
import type { ListType } from '~/api/address/model';
import PersonalCenter from './components/personal-center.vue';
import Form from './components/form-address.vue';
import { apiGetCategoryOptions } from '~/api/address-category/request';
import { apiGetList, apiDelete, apiGetIcons } from '~/api/address/request';

const { $dayjs, $confirm, $message } = useNuxtApp();
let addressNavigationList: LabelValue[] = [];
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
    type: 'div',
    slotName: 'image'
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
const btnLoadingIcon = ref(false);
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

function getOptions() {
  apiGetCategoryOptions().then(res => {
    addressNavigationList = res.data.map(e => {
      return {
        value: e.id,
        label: e.name
      }
    });
    getTableData();
  }).catch((e) => {
    console.log(e);
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
      e.createTime = e.createTime ? $dayjs(e.createTime).format('YYYY-MM-DD HH:mm:ss') : '暂无';
      e.updateTime = e.updateTime ? $dayjs(e.updateTime).format('YYYY-MM-DD HH:mm:ss') : '暂无';
      e.category = getListLabel(e.categoryId, addressNavigationList) || '';
      return e;
    });
    loading.value = false;
  }).catch((e) => {
    loading.value = false;
    console.log(e);
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

function handleGetIcons() {
  btnLoadingIcon.value = true;
  apiGetIcons().then(res => {
    btnLoadingIcon.value = false;
    if (res.succeeded) {
      $message.show({
        message: res.data || res.errors,
        type: res.data ? 'success' : 'warning'
      });
      getTableDataByPagination();
    } else {
      $message.show({
        message: res.errors,
        type: 'error'
      });
      btnLoadingIcon.value = false;
    }
  }).catch(e => { 
    btnLoadingIcon.value = false;
  });
}

getOptions();

const operateRef = ref<HTMLElement | undefined>();
const tableHeight = ref<string>('');
onNuxtReady(() => {
  const info = operateRef.value?.getBoundingClientRect();
  if (info) {
    tableHeight.value = `${window.innerHeight - info.height - 80 - 80 - 40 - 20 - 68 - 16}px`;
  }
});
</script>
<template>
  <personal-center>
    <div class="main__content flex__column nowrap">
      <div class="mb1" ref="operateRef">
        <com-button prefix-icon="profile-add" class="mr1" @click="handleAdd">新增导航地址</com-button>
        <com-button prefix-icon="profile-arrow" :loading="btnLoadingIcon" @click="handleGetIcons">获取icon</com-button>
      </div>
      <div class="flex1" v-loading="loading">
        <com-table :head="tableHead" :data="tableData" :height="tableHeight" @click="handleTableClick">
          <template #image="{ data }">
            <div class="table__cell overflow-hidden">
              <img class="table__image" :src="data.iconUrl" :alt="data.name" />
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