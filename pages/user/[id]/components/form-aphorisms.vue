<script lang="ts" setup>
import type { AddModel, EditModel } from '~/api/aphorisms/model';
import { apiAdd, apiUpdate } from '~/api/aphorisms/request';

const { tagList } = options;
const { $message } = useNuxtApp();
const formRef = ref();

const emit = defineEmits<{
  'refreshData': []
}>()
const visible = ref(false);
const formRenderType = ref<FormEditAdd>('add');
const editId = ref();
const title = computed(() => {
  return formRenderType.value === 'add' ? '添加标签' : '编辑标签';
});

const formConfig = ref<Array<FormConfig>>([
  {
    require: true,
    field: 'content',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入名言内容',
      clearable: true,
    }
  },
  {
    require: false,
    field: 'from',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入出处',
      clearable: true,
    }
  }
]);

function setFormData(data: EditModel) {
  formConfig.value = formConfig.value.map(e => {
    if (Object.hasOwn(data, e.field)) {
      e.data = data[e.field].toString();
      if (e.type === 'select') {
        e.data = getListValue(e.data, tagList);
      }
    }
    return e;
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
          content: val.data.content,
          from: val.data.from,
        }
        apiAdd(params).then(res => {
          $message.show({
            message: res.data,
            type: res.succeeded ? 'success' : 'info'
          });
          if (res.succeeded) {
            close();
            emit('refreshData');
          }
        });
      } else {
        const params: EditModel = {
          id: editId.value,
          content: val.data.content,
          from: val.data.from,
        }
        apiUpdate(params).then(res => {
          $message.show({
            message: res.data || res.errors,
            type: res.succeeded ? 'success' : 'info'
          });
          if (res.succeeded) {
            close();
            emit('refreshData');
          }
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
      <com-form 
        ref="formRef" 
        class="flex__row--start"
        :model="formConfig"
      ></com-form>
    </div>
  </com-model-confirm>
</template>
<style scoped>

.form__body {
  padding: 20px;
  background-color: var(--white-color);
}
</style>