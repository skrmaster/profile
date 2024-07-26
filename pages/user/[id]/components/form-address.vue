<script lang="ts" setup>
import type { AddModel, EditModel } from '~/api/address/model';
import { apiAdd, apiUpdate } from '~/api/address/request';
import { apiGetCategoryOptions } from '~/api/address-category/request';
import { apiAdd as fileApiAdd } from '~/api/upload/request';
import type { AddModel as FileAddModel  } from '~/api/upload/model';

type FormConfigHasAdd = FormConfig & { isAdd?: boolean } & { index?: number };

const addressNavigationList = ref<LabelValue[]>([]);
const { $message } = useNuxtApp();
const formRef = ref();

const emit = defineEmits<{
  'refreshData': []
}>()
const visible = ref(false);
const formRenderType = ref<FormEditAdd>('add');
const editId = ref();
const title = computed(() => {
  return formRenderType.value === 'add' ? '添加导航地址' : '编辑导航地址';
});

let deleteFormConfigItem: FormConfigHasAdd[] = [];
const formConfig = ref<Array<FormConfigHasAdd>>([
  {
    index: 0,
    require: true,
    field: 'name',
    type: 'textarea',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入导航地址名称',
      clearable: true,
    }
  },
  {
    index: 1,
    isAdd: true,
    require: false,
    field: 'link',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入导航地址',
      clearable: true,
    }
  },
  {
    index: 2,
    require: false,
    field: 'iconUrl',
    type: 'text',
    rule: '',
    data: '',
    elementConfig: {
      layout: 'column',
      width: '100%',
      placeholder: '网站图标地址',
      clearable: true,
    }
  },
  {
    index: 3,
    isAdd: true,
    require: true,
    field: 'category',
    type: 'select',
    rule: '',
    data: '',
    elementConfig: {
      layout: 'column',
      width: '100%',
      placeholder: '导航地址分类',
      clearable: false,
      optionList: []
    }
  },
  {
    index: 4,
    require: false,
    field: 'needUpdate',
    type: 'switch',
    rule: '',
    data: '',
    elementConfig: {
      layout: 'column',
      activeLabel: '需要更新',
      inActiveLabel: '不需要更新'
    }
  },
  {
    index: 5,
    require: false,
    field: 'upload',
    type: 'upload',
    rule: '',
    data: '',
    elementConfig: {
      label: '网站favicon',
      fileList: [],
      limit: 1
    }
  }
]);
let domainStr: string;
let uploadFullUrl: string;

function getOptions() {
  apiGetCategoryOptions().then(res => {
    addressNavigationList.value = res.data.map(e => {
      return {
        value: e.id,
        label: e.name
      }
    });
    const index = formConfig.value.findIndex(e => e.type === 'select');
    if (index > -1) {
      formConfig.value[index].elementConfig.optionList = addressNavigationList.value;
    }
  }).catch((e) => {
    console.log(e);
  });
}

function setFormData(data: EditModel) {
  formConfig.value = formConfig.value.map(e => {
    if (Object.hasOwn(data, e.field)) {
      e.data = data[e.field]?.toString();
      if (e.type === 'select') {
        e.data = getListValue(e.data, addressNavigationList.value);
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
          link: val.data.link,
          categoryId: val.data.category,
          needUpdate: 1,
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
          link: val.data.link,
          categoryId: val.data.category,
          needUpdate: val.data.needUpdate,
          iconUrl: uploadFullUrl ? uploadFullUrl : val.data.iconUrl
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
  if (deleteFormConfigItem.length === 0) {
    deleteFormConfigItem = formConfig.value.flatMap((e: FormConfigHasAdd, i) => {
      if (!e.isAdd) {
        return e;
      } else {
        return [];
      }
    });
  }

  domainStr = '';
  uploadFullUrl = '';
  if (formData) {
    domainStr = getDomainNameFromUrl(formData.link);
  }

  if (formData?.id) {
    formRenderType.value = 'edit';
    editId.value = formData.id;
    if (deleteFormConfigItem.length > 0 && !formConfig.value.find(e => !e.isAdd)) {
      deleteFormConfigItem.forEach(e => {
        if (e.index === 0 || e.index) {
          formConfig.value.splice(e.index, 0, e);
        }
      });
      deleteFormConfigItem = [];
    }
    setFormData(formData);
    const index = formConfig.value.findIndex(e => e.type === 'upload');
    
    formConfig.value[index].elementConfig.fileList = [
      {
        id: Math.random().toString(),
        fullPath: getImageHref(formData.iconUrl)
      }
    ]

  } else {
    formRenderType.value = 'add';
    editId.value = undefined;
    clearFormData();
    for (let i = 0; i < formConfig.value.length; i++) {
      let e = formConfig.value[i];
      if (!e.isAdd) {
        formConfig.value.splice(i, 1);
        i--;
      }
    }
  }
}

function close() {
  visible.value = false;
}

async function handleUploadFile(list: Array<Upload.FileInfo | File>) {
  for await (let item of list) {
    if (!isFile(item)) {
      continue;
    }

    const params: FileAddModel = {
      category: 0,
      file: item
    }
    
    fileApiAdd(params).then(res => {
      uploadFullUrl = res.data.fullPath;
    }).catch(() => {});
  }
}

getOptions();

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
        @uploadFile="handleUploadFile"
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