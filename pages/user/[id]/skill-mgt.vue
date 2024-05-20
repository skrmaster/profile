<script lang="ts" setup>
import type { EditModel, SkillListType } from '~/api/skill/skillModel';
import PersonalCenter from './components/personal-center.vue';
import SkillForm from './components/skill-form.vue';
import { apiSkillGetList } from '~/api/skill/request';

const { $dayjs, $confirm, $message }: any = useNuxtApp();
const formRef = ref();
const paginationRef = ref();
const tableHead = ref<TableHead[]>([
  {
    name: '技能名称',
    field: 'name',
    width: '180px'
  },
  {
    name: '技能熟练度',
    width: '120px',
    field: 'proficiency',
  },
  {
    name: '排序',
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
    width: '100px',
    operate: ['edit', 'delete']
  }
]);
const tableData = ref<SkillListType>([]);
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 20
});

function handleAddSkill() {
  $confirm.show({message: '123'});
  // formRef.value.open();
}

function handleEditSkill(skill: Record<string, any>) {
  formRef.value.open(skill);
}

function handleDeleteSkill(id: Record<string, any>) {

}

function getTableData() {
  const params: Omit<Pagination, 'total'> = {
    page: pagination.page,
    pageSize: pagination.pageSize
  }

  apiSkillGetList(params).then(res => {
    Object.assign(pagination ,res.data.pagination);
    tableData.value = res.data.list.map(e => {
      e.createTime = $dayjs(e.createTime).format('YYYY-MM-DD HH:mm:ss');
      e.updateTime = $dayjs(e.updateTime).format('YYYY-MM-DD HH:mm:ss');
      return e;
    });
  });
}

function handleTableClick(type: TableCell, data: Record<string, any>) {
  switch (type) {
    case 'edit':
      handleEditSkill(data);
      break;
    case 'delete':
      handleDeleteSkill(data);
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
    <div class="main__content flex__column">
      <div class="mb1">
        <com-button icon="profileadd" @click="handleAddSkill">新增技能</com-button>
      </div>
      <div class="flex1">
        <com-table :head="tableHead" :data="tableData" @click="handleTableClick"></com-table>
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
  flex: 1;
  background: var(--white-color);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 20px 16px;
}
</style>