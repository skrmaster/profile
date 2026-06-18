<script lang="ts" setup>
import type { ListType } from "~/api/skill/model";
import PersonalCenter from "./components/personal-center.vue";
import SkillForm from "./components/form-skill.vue";
import { apiSkillGetList, apiSkillDelete } from "~/api/skill/request";

const { $dayjs, $confirm, $message } = useNuxtApp();
const formRef = ref();
const paginationRef = ref();
const tableHead = ref<TableHead[]>([
  {
    name: "技能名称",
    field: "name",
    width: "180px",
  },
  {
    name: "技能熟练度",
    width: "120px",
    field: "proficiency",
  },
  {
    name: "排序",
    width: "100px",
    field: "sort",
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
    width: "100px",
    operate: ["edit", "delete"],
  },
]);
const tableData = ref<ListType>([]);
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20,
});
const loading = ref(false);

const operateRef = ref<HTMLElement | undefined>();
const tableHeight = ref<string>("");

function handleAddSkill() {
  formRef.value.open();
}

function handleEditSkill(skill: Record<string, any>) {
  formRef.value.open(skill);
}

function handleDeleteSkill(skill: Record<string, any>) {
  $confirm
    .confirm({
      message: "请确认，这将会删除该条数据",
    })
    .then(() => {
      apiSkillDelete(skill.id).then((_) => {
        $message.show({
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

  apiSkillGetList(params)
    .then((res) => {
      Object.assign(pagination, res.pagination);
      tableData.value = res.list.map((e) => {
        e.createTime = $dayjs(e.createTime).format("YYYY-MM-DD HH:mm:ss");
        e.updateTime = $dayjs(e.updateTime).format("YYYY-MM-DD HH:mm:ss");
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
      handleEditSkill(data);
      break;
    case "delete":
      handleDeleteSkill(data);
      break;
    case "cell":
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
        <com-button prefix-icon="profile-add" @click="handleAddSkill"
          >新增技能</com-button
        >
      </div>
      <div class="flex1" v-loading="loading">
        <com-table
          :head="tableHead"
          :data="tableData"
          @click="handleTableClick"
          :height="tableHeight"
        ></com-table>
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
    <skill-form ref="formRef" @refresh-data="getTableData"></skill-form>
  </personal-center>
</template>
<style scoped>
.main__content {
  background: var(--white-color);
  border-radius: 10px;
  padding: 20px 16px;
}
</style>
