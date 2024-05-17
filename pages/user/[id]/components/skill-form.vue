<script lang="ts" setup>
import type { AddModel, EditModel } from '~/api/skill/skillModel';

const formRef = ref();

const visible = ref(true);
const formRenderType = ref<FormEditAddType>('add');
const title = computed(() => {
  return formRenderType.value === 'add' ? '添加技能' : '编辑技能';
});

const formConfig: Array<FormConfig> = [
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
];

function setFormData(data: EditModel) {
  formConfig.forEach(e => {
    if (Object.hasOwn(data, e.field)) {
      e.data = data[e.field];
    }
  });
}

function clearFormData() {
  formConfig.forEach(e => {
    e.data = '';
  });
}

function submitData() {
  formRef.value.vaildForm().then((val: ReturnVaildForm) => {
    if (val.vaild) {
      console.log(val.data);
    }
  });
}

function open(formData?: EditModel) {
  visible.value = true;
  if (formData?.id) {
    formRenderType.value = 'edit';
    setFormData(formData);
  } else {
    formRenderType.value = 'add';
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
    v-model="visible"
    @confirm="submitData"
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