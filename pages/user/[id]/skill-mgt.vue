<script lang="ts" setup>
import type { EditModel, SkillListType } from '~/api/skill/skillModel';
import PersonalCenter from './components/personal-center.vue';
import SkillForm from './components/skill-form.vue';
import { apiSkillGetList } from '~/api/skill/request';

const formRef = ref();
const tableHead = ref<TableHead[]>([
  {
    name: "技能名称",
    field: "name",
    width: "100px"
  },
  {
    name: "技能熟练度",
    field: "proficiency",
  },
  {
    name: "排序",
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
    operate: ['edit', 'delete']
  }
]);
const tableData = ref<SkillListType>([]);

function handleAddSkill() {
  formRef.value.open();
}

function handleEditSkill(skill: Record<string, any>) {
  formRef.value.open(skill);
}

function getTableData() {
  apiSkillGetList().then(res => {
    tableData.value = res.data;
  });
}

function handleTableClick(type: CellType, data: Record<string, any>) {
  switch (type) {
    case 'edit':
      handleEditSkill(data);
      break;
    case 'delete':

      break;
    case 'cell':
      break;
    default:
      break;
  }
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
        <com-pagination></com-pagination>
      </div>
    </div>
    <skill-form ref="formRef"></skill-form>
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