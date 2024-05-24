<script lang="ts" setup>
import type { AddModel, EditModel } from '~/api/skill/model';
import { apiSkillAdd, apiSkillUpdate } from '~/api/skill/request';

const { $message }: any = useNuxtApp();
const formRef = ref();

const emit = defineEmits<{
  'refreshData': []
}>()
const visible = ref(false);
const formRenderType = ref<FormEditAdd>('add');
const editId = ref();
const title = computed(() => {
  return formRenderType.value === 'add' ? '添加技能' : '编辑技能';
});

const formConfig = ref<Array<FormConfig>>([
  {
    require: true,
    field: 'name',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入技能名称',
      clearable: true,
    }
  },
  {
    require: true,
    field: 'proficiency',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入熟练度0~100',
      clearable: true,
    }
  },
  {
    require: true,
    field: 'sort',
    type: 'number',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入排序',
      clearable: false,
      rows: 8,
    }
  }
]);

function setFormData(data: EditModel) {
  formConfig.value = formConfig.value.map(e => {
    if (Object.hasOwn(data, e.field)) {
      e.data = data[e.field].toString();
    }

    return e
  });
}

function clearFormData() {
  formConfig.value = formConfig.value.map(e => {
    e.data = '';

    return e
  });
}

function submitData() {
  formRef.value.vaildForm().then((val: ReturnVaildForm) => {
    if (val.vaild) {
      if (formRenderType.value === 'add') {
        const params: AddModel = {
          name: val.data.name,
          proficiency: val.data.proficiency,
          sort: val.data.sort
        }
        apiSkillAdd(params).then(res => {
          $message.show({
            message: '添加成功',
            type: 'success'
          });
          close();
          emit('refreshData');
        });
      } else {
        const params: EditModel = {
          id: editId.value,
          name: val.data.name,
          proficiency: val.data.proficiency,
          sort: val.data.sort
        }
        apiSkillUpdate(params).then(res => {
          $message.show({
            message: '更新成功',
            type: 'success'
          });
          close();
          emit('refreshData');
        });
      }
    }
  });
}

function open(formData?: EditModel) {
  visible.value = true;

  if (formData?.id) {
    formRenderType.value = 'edit';
    editId.value = formData.id;
    setFormData(formData);
  } else {
    formRenderType.value = 'add';
    editId.value = undefined;
    clearFormData();
  }
}

function close() {
  visible.value = false;
}


defineExpose({
  open,
  close
})
</script>
<template>
  <com-model-confirm
    to-body
    v-model="visible"
    @confirm="submitData"
    :after-close="clearFormData"
  >
    <div class="form__body">
      <div class="mb1">
        <span class="common__title">{{ title }}</span>
      </div>
      <com-form ref="formRef" :model="formConfig"></com-form>
    </div>
  </com-model-confirm>
</template>
<style scoped>

.form__body {
  padding: 20px;
  background-color: var(--white-color);
}
</style>