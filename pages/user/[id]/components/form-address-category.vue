<script lang="ts" setup>
import type { AddModel, EditModel } from '~/api/address-category/model';
import { apiAdd, apiUpdate } from '~/api/address-category/request';

const { addressNavigationList } = options;
const { $message } = useNuxtApp();
const formRef = ref();

const emit = defineEmits<{
  'refreshData': []
}>()
const visible = ref(false);
const formRenderType = ref<FormEditAdd>('add');
const editId = ref();
const title = computed(() => {
  return formRenderType.value === 'add' ? '添加导航分类' : '编辑导航分类';
});

let deleteFormConfigItem: FormConfig | null = null;
const formConfig = ref<Array<FormConfig>>([
  {
    require: true,
    field: 'name',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入导航分类名称',
      clearable: true,
    }
  },
  {
    require: false,
    field: 'sort',
    type: 'number',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输排序',
      clearable: true,
    }
  },
  {
    require: false,
    field: 'display',
    type: 'switch',
    rule: '',
    data: '',
    elementConfig: {
      layout: 'column',
      activeLabel: '展示',
      inActiveLabel: '不展示'
    }
  },
  {
    require: false,
    field: 'iconClass',
    type: 'icon-choose',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请选择图标'
    }
  }
]);

function setFormData(data: EditModel) {
  formConfig.value = formConfig.value.map(e => {
    if (Object.hasOwn(data, e.field)) {
      e.data = data[e.field].toString();
      if (e.type === 'select') {
        e.data = getListValue(e.data, addressNavigationList);
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
          sort: val.data.sort,
          iconClass: val.data.iconClass,
          display: val.data.display
        }
        apiAdd(params).then(res => {
          $message.show({
            message: res.data && "操作成功",
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
          sort: val.data.sort,
          iconClass: val.data.iconClass,
          display: val.data.display
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
  const deleteItem = formConfig.value.find(item => item.field === 'name');
  if (deleteItem) {
    deleteFormConfigItem = deleteItem;
  }

  if (formData?.id) {
    formRenderType.value = 'edit';
    editId.value = formData.id;
    if (!deleteItem) {
      formConfig.value.splice(0, 0, deleteFormConfigItem as FormConfig);
    }
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