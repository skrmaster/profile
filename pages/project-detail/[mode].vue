<script lang="ts" setup>
import { apiAdd as fileApiAdd } from '~/api/upload/request';
import { apiAdd, apiGetInfo, apiUpdate } from '~/api/project/request';
import type { AddModel as FileAddModel } from '~/api/upload/model';
import type { AddModel, EditModel } from '~/api/project/model';
import projectDetailView from './project-detail-view.vue';

const { $message, $dayjs } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const mode = route.params.mode as DetailTitle.Mode;
const projectId = route.query.id as string;

if (mode === 'add') {
  useHead({
    title: '添加项目'
  });
} else if (mode === 'edit') {
  useHead({
    title: '编辑项目'
  });
  initEditData();
}

const list = ref<StackItem[]>([]);
const images = ref<Upload.FileInfo[]>([]);
const fileList = ref<Array<Upload.FileInfo>>([]);
const status = ref<string | number | undefined>();

const formData = reactive<Omit<AddModel, 'name' | 'status'>>({
  playLink: '',
  summary: '',
  description: '',
  department: '',
  startTime: $dayjs().format('YYYY-MM-DD'),
  endTime: $dayjs().format('YYYY-MM-DD'),
  sort: 1
});
const startMinTime = ref();
const endMinTime = ref();
const projectName = ref('');

watch(() => formData.startTime, (val) => {
  if ($dayjs(val).isAfter($dayjs(formData.endTime))) {
    formData.endTime = formData.startTime;
  }
  endMinTime.value = val;
});

function initEditData() {
  apiGetInfo(projectId)
  .then(res => {
    Object.assign(formData, res.data);
    projectName.value = res.data.name;

    const stackIds: string[] = res.data.stackIds ? JSON.parse(res.data.stackIds) : [];
    
    list.value = stackIds?.map(e => {
      return {
        name: e,
        icon: '',
        officalUrl: '',
        isChoose: false
      }
    });

    status.value = res.data.status;
    formData.startTime = timeNullFormat(res.data.startTime, 'YYYY-MM-DD');
    formData.endTime = timeNullFormat(res.data.endTime, 'YYYY-MM-DD');

    const imageIds: Upload.FileInfo[] = res.data.imageIds ? JSON.parse(res.data.imageIds) : [];
    fileList.value = imageIds.map((e) => {
      return {
        id: e.id,
        fullPath: splicingImageUrl(e.fullPath) || ""
      }
    });
    images.value = [...fileList.value];
  }).catch((e) => {
    console.log(e);
  });
}

function handleStackListChange(val: StackItem[]) {
  let remainArr = [];
  let addArr = [];
  
  for (let i = 0; i < val.length; i++) {
    let e = val[i];
    let idx = list.value.findIndex(item => item.name === e.name);

    if (idx > -1) {
      remainArr.push(e);
    } else {
      addArr.push(e);
    }
  }

  list.value.splice(0, list.value.length, ...remainArr, ...addArr);
}

async function handleFileUpload(list: Array<Upload.FileInfo | File>) {
  for await (let item of list) {
    if (!isFile(item)) {
      continue;
    }

    const params: FileAddModel = {
      category: 0,
      file: item
    }
    fileApiAdd(params).then(res => {
      images.value.push(res.data)
    }).catch(() => {

    });
  }
}

function handleSubmit(val: DetailTitle.Action, title: string) {
  let isEdit = false;
  const params: AddModel = {
    status: 0,
    ...formData,
    name: title,
    imageIds: JSON.stringify(unref(images)),
    stackIds: JSON.stringify(unref(list).map(e => e.name)),
  }

  switch (val) {
    case 'submit':
      params.status = 1;
      break;
    case 'submit-tmp':
      params.status = 0;
      break;
    case 'submit-edit':
      isEdit = true;
      break;
    default:
      break;
  }
  if (!isEdit) {
    apiAdd(params).then(res => {
      $message.show({
        message: res.data,
        type: res.succeeded ? 'success' : 'info'
      });
      if (res.succeeded) {
        router.back();
      }
    }).catch(() => {});
  } else {
    const p: EditModel = {
      ...params,
      id: projectId,
    }
    apiUpdate(p).then(res => {
      $message.show({
        message: res.data,
        type: res.succeeded ? 'success' : 'info'
      });
      if (res.succeeded) {
        router.back();
      }
    }).catch(e => {});
  }
  
}

</script>
<template>
  <com-background 
    v-if="mode !== 'view'"
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="false"
  >
    <detail-title 
      :mode="mode"
      :status="status"
      :title-value="projectName"
      @button-action="handleSubmit"
      class="edit__title"
    ></detail-title>
    <section>
      <div class="container flex__column">
        <div>
          <div class="flex__row mt5 flex-wrap">
            <label class="demo__label text-center">
              演示地址
            </label>
            <div class="flex1">
              <com-form-input
                class="demo__input"
                width="625"
                v-model="formData.playLink" 
                placeholder="演示地址"
                :is-label="false"
              ></com-form-input>
            </div>
          </div>
          <div class="flex__row my2">
            <label>
              项目开始时间
            </label>
            <input type="date" v-model="formData.startTime" :min="startMinTime" />
          </div>
          <div class="flex__row my2">
            <label>
              项目结束时间
            </label>
            <input type="date" v-model="formData.endTime" :min="endMinTime" />
          </div>
          <div class="flex__row my2">
            <label class="stack__label flex__center">技术栈</label>
            <!-- <div class="stack flex__center">+</div> -->
            <com-tech-stack 
              :data-list="list"
              mode="add"
              @update="handleStackListChange"
            ></com-tech-stack>
          </div>
          <div class="flex__row--start flex-wrap">
            <label>项目图片</label>
            <div>
              <com-upload
                :data-list="fileList"
                @file-monuted="handleFileUpload"
              ></com-upload>
            </div>
          </div>
          <div class="flex__row--start my3 flex-wrap">
            <label>排序</label>
            <div class="flex1">
              <com-form-input
                width="100"
                :is-label="false"
                placeholder="请输入排序"
                v-model="formData.sort" 
                type="number"
              ></com-form-input>
            </div>
          </div>
          <div class="flex__row--start my3 flex-wrap">
            <label>概述</label>
            <div class="flex1">
              <com-form-input 
                class="detail__textarea"
                :is-label="false"
                placeholder="请输入概述"
                v-model="formData.summary" 
                type="textarea"
              ></com-form-input>
            </div>
          </div>
          <div class="flex__row--start my3 flex-wrap">
            <label>介绍</label>
            <div class="flex1">
              <com-form-input 
                class="detail__textarea"
                :is-label="false"
                placeholder="请输入介绍"
                v-model="formData.description" 
                type="textarea"
              ></com-form-input>
            </div>
          </div>
          <div class="flex__row--start my3">
            <label>负责部分</label>
            <div class="flex1">
              <com-form-input 
                class="detail__textarea"
                placeholder="请输入负责部分"
                :is-label="false"
                v-model="formData.department" 
                type="textarea"
              ></com-form-input>
            </div>
          </div>
        </div>
      </div>
    </section>
  </com-background>
  <project-detail-view :project-id="projectId" v-else></project-detail-view>
</template>
<style scoped>
.edit__title {
  position: sticky;
  top: 0;
  background: var(--white-color);
  z-index: 999;
}

.demo__label {
  max-width: 120px;
  width: 100%;
  min-width: 50px;
  height: 70px;
  line-height: 70px;
  font-size: 18px;
  background-color: var(--white-color);
  border-radius: 20px 0 0 20px;
  margin-right: 4px;
}

.demo__input {
  height: 70px;
  border: 0;
  outline: 0;
  border-radius: 0 20px 20px 0;
}

:deep(.demo__input input) {
  height: 70px;
  background-color: var(--white-color);
  border-radius: 10px;
  text-indent: 1.5em!important;
}

label {
  display: block;
  text-align: center;
  max-width: 120px;
  width: 100%;
  min-width: 50px;
}

.stack {
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  width: 71px;
  height: 37px;
}

.detail__textarea {
  overflow: hidden;
  border: 0;
  outline: 0;
  border-radius: 20px;
  background-color: var(--white-color);
  box-shadow: 0px 5px 11px 0px rgba(0, 0, 0, 0.25);
  max-width: 1500px;
  min-height: 323px;
  width: 100%;
}

:deep(.detail__textarea .form__input-field:focus) {
  background-color: var(--white-color);
}

:deep(.detail__textarea .form__input-field) {
  text-indent: 0;
  height: 323px;
  padding: 20px;
  background-color: var(--readonly-color);
}

input[type="date"] {
  height: 60px;
  padding: 0 20px;
  font-size: 18px;
  border-radius: var(--border-radius-large);
}
</style>