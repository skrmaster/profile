<script lang="ts" setup>
import type { List } from "~/api/record/model";
import PersonalCenter from "./components/personal-center.vue";
import { apiGetList, apiDelete } from "~/api/record/request";

const { $dayjs, $confirm, $message } = useNuxtApp();
const { projectRecordtatus, recordCategory } = options;
const { recordDetailPath } = routerMap;
const paginationRef = ref();
const loading = ref(false);
const tableHead = ref<TableHead[]>([
  {
    name: "记录标题",
    field: "title",
    width: "180px",
  },
  {
    name: "记录状态",
    width: "200px",
    field: "status",
  },
  {
    name: "记录分类",
    width: "100px",
    field: "category",
  },
  {
    name: "创建时间",
    field: "createTime",
  },
  {
    name: "更新时间",
    field: "updateTime",
  },
  {
    name: "操作",
    fixed: "right",
    width: "150px",
    operate: ["view", "edit", "delete"],
  },
]);
const tableData = ref<List>([]);
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20,
});

function handleAdd() {
  navigateTo({
    path: recordDetailPath + "/add",
  });
}

function handleEdit(item: Record<string, any>) {
  navigateTo({
    path: recordDetailPath + "/edit",
    query: {
      id: item.id,
    },
  });
}

function handleView(item: Record<string, any>) {
  navigateTo({
    path: recordDetailPath + "/view",
    query: {
      id: item.id,
    },
  });
}

function handleDelete(item: Record<string, any>) {
  $confirm
    .confirm({
      message: "请确认，这将会删除该条数据",
    })
    .then(() => {
      apiDelete(item.id).then((_) => {
        $message.show({
          type: "success",
          message: "操作成功",
        });
        getTableData();
      });
    })
    .catch(() => {});
}

function getTableData() {
  loading.value = true;
  const params: Omit<Pagination, "total"> = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  apiGetList(params)
    .then((res) => {
      Object.assign(pagination, res.pagination);
      tableData.value = res.list.map((e) => {
        e.createTime = e.createTime
          ? $dayjs(e.createTime).format("YYYY-MM-DD HH:mm:ss")
          : "暂无";
        e.updateTime = e.updateTime
          ? $dayjs(e.updateTime).format("YYYY-MM-DD HH:mm:ss")
          : "暂无";
        e.status =
          getListLabel(
            e.status?.toString() ? e.status.toString() : "",
            projectRecordtatus,
          ) ?? "未知";
        e.category =
          getListLabel(e.category.toString(), recordCategory) ?? "未知";
        return e;
      });
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleTableClick(type: TableCell, data: Record<string, any>) {
  switch (type) {
    case "edit":
      handleEdit(data);
      break;
    case "delete":
      handleDelete(data);
      break;
    case "view":
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

const operateRef = ref<HTMLElement | undefined>();
const tableHeight = ref<string>("");
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
        <com-button prefix-icon="profile-add" @click="handleAdd"
          >新增记录</com-button
        >
      </div>
      <div class="flex1" v-loading="loading">
        <com-table
          :head="tableHead"
          :data="tableData"
          :height="tableHeight"
          @click="handleTableClick"
        >
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
