<script lang="ts" setup>
import type { AddModel, EditModel } from '~/api/tag/model';
import { apiAdd, apiUpdate } from '~/api/tag/request';

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
    field: 'name',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入标签名称',
      clearable: true,
    }
  },
  {
    require: false,
    field: 'icon',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入标签图标地址',
      clearable: true,
    }
  },
  {
    require: true,
    field: 'category',
    type: 'select',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '标签分类',
      clearable: false,
      optionList: tagList
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
          name: val.data.name,
          icon: val.data.icon,
          category: val.data.category
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
          name: val.data.name,
          icon: val.data.icon,
          category: val.data.category
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